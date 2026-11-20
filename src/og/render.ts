import { a as renderPng } from 'cf-workers-og-renderer';
import { env } from 'cloudflare:workers';
import { generateAdvisory } from '../advisories/generate.ts';
import type { Locale } from '../i18n/messages.ts';
import { matchSiteHost } from '../routing/hostname.ts';
import { ogCard } from './card.tsx';
import { fallbackAvailable, missingGlyphs } from './fallback.ts';
import { ogImageVersion } from './version.ts';

// A card never changes for a given host, language and version, so crawlers and the edge can keep it for a week.
const cacheControl = 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';
let fontData: Promise<ArrayBuffer> | undefined;

const loadFont = (url: URL) => {
  fontData ??= env.ASSETS.fetch(new Request(new URL('/fonts/noto-sans-jp-regular.otf', url))).then((font) => {
    if (!font.ok) throw new Error('The bundled Open Graph font could not be loaded.');
    return font.arrayBuffer();
  });
  // A failed load must not stay cached for the lifetime of the isolate.
  fontData.catch(() => { fontData = undefined; });
  return fontData;
};

/** Render the social card for a supported request hostname and language, reusing the edge copy when one exists.
 * @example await renderOg(new URL('http://toaster.localhost:4321/ja/og.png'), 'ja')
 */
export const renderOg = async (url: URL, locale: Locale) => {
  const host = matchSiteHost(url.hostname);
  if (host.kind === 'unknown' || host.kind === 'redirect') return new Response(null, { status: 404 });

  // Ignore crawler-added query parameters so every request for the same card shares one cache entry.
  const key = new Request(url.origin + url.pathname + '?v=' + ogImageVersion);
  const cache = (caches as unknown as { default: Cache }).default;
  const cached = await cache.match(key);
  if (cached) return cached;

  const [advisory, font] = await Promise.all([
    host.kind === 'advisory' ? generateAdvisory(host.label) : null,
    loadFont(url),
  ]);
  // Characters outside Noto Sans JP, including emoji, are loaded from public/og by Satori on demand.
  // A fallback font that the renderer cannot parse must not cost the whole card, so each retry drops one layer:
  // first the extra fonts (keeping emoji images), then every additional asset.
  const fullLoader = missingGlyphs(url.origin);
  const loaders = [
    fullLoader,
    async (code: string, segment: string) => code === 'emoji' ? fullLoader(code, segment) : [],
    undefined,
  ];
  let body: Uint8Array<ArrayBuffer> | undefined;
  let complete = await fallbackAvailable(url.origin);
  for (const [attempt, loadAdditionalAsset] of loaders.entries()) {
    try {
      body = await renderPng(ogCard(locale, advisory), {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Noto Sans JP', data: font, weight: 400 }],
        loadAdditionalAsset,
      });
      break;
    } catch (error) {
      complete = false;
      if (attempt === loaders.length - 1) throw error;
      console.warn('Social card fallback failed; retrying with fewer assets.', String(error));
    }
  }
  if (!body) throw new Error('The social card could not be rendered.');
  const response = new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(body.byteLength),
      'Cache-Control': cacheControl,
    },
  });
  // A card drawn without the fallback assets is served but not cached, so it is redrawn once they are available.
  if (complete) await cache.put(key, response.clone());
  return response;
};
