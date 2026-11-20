import { handle } from '@astrojs/cloudflare/handler';
import { matchSiteHost, siteUrl } from './routing/hostname.ts';

const fetch: typeof handle = async (request, env, context) => {
  const url = new URL(request.url);
  const host = matchSiteHost(url.hostname);

  // Run this before Astro's asset handling so www never serves a separate copy.
  if (host.kind === 'redirect') {
    const destination = siteUrl(url, host.base, url.pathname);
    destination.search = url.search;
    return Response.redirect(destination.href, 301);
  }

  return handle(request, env, context);
};

export default { fetch };
