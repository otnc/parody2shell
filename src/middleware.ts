import { defineMiddleware } from 'astro:middleware';
import { localeForPath } from './i18n/messages.ts';
import { matchSiteHost, parseSubjectLabel, siteUrl } from './routing/hostname.ts';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const host = matchSiteHost(url.hostname);
  const languagePath = url.pathname === '/' || url.pathname === '/ja' || url.pathname === '/ja/';
  if (host.kind === 'home' && languagePath) {
    const input = url.searchParams.get('subject');
    const label = input === null ? null : parseSubjectLabel(input);
    if (label) {
      const pathname = localeForPath(url.pathname) === 'ja' ? '/ja' : '/';
      return context.redirect(siteUrl(url, host.base, pathname, label).href, 302);
    }
  }

  return next();
});
