import { ImageResponse } from 'cf-workers-og/workerd';
import { env } from 'cloudflare:workers';
import { generateAdvisory } from '../advisories/generate.ts';
import type { Locale } from '../i18n/messages.ts';
import { matchSiteHost } from '../routing/hostname.ts';
import { ogCard } from './card.tsx';

/** Render the social card for a supported request hostname and language.
 * @example await renderOg(new URL('http://toaster.localhost:4321/ja/og.png'), 'ja')
 */
export const renderOg = async (url: URL, locale: Locale) => {
  const host = matchSiteHost(url.hostname);
  if (host.kind === 'unknown' || host.kind === 'redirect') return new Response(null, { status: 404 });

  const advisory = host.kind === 'advisory' ? await generateAdvisory(host.label) : null;
  const font = await env.ASSETS.fetch(new Request(new URL('/fonts/noto-sans-jp-regular.otf', url)));
  if (!font.ok) throw new Error('The bundled Open Graph font could not be loaded.');

  return ImageResponse.create(ogCard(locale, advisory), {
    width: 1200,
    height: 630,
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    fonts: [{ name: 'Noto Sans JP', data: await font.arrayBuffer(), weight: 400 }],
  });
};
