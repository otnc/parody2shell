import { domainToASCII, domainToUnicode } from 'node:url';

type SubjectLabel = string & { readonly subjectLabel: unique symbol };

const asciiLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const domainSuffix = '.invalid';
// These labels redirect to the apex instead of opening an advisory. The last one is パロディ.
const reservedLabels = new Set(['www', 'parody', 'xn--dckud3a9h']);

/** Normalize one subject label for both the form and requests.
 * @example parseSubjectLabel('日本語') // 'xn--wgv71a119e'
 */
export const parseSubjectLabel = (input: string): SubjectLabel | null => {
  const subject = input.trim();
  if (/[\s:/\\?#@%]/u.test(subject)) return null;

  // A suffix keeps a numeric subject such as 123 from being parsed as an IPv4 address.
  const domain = domainToASCII(subject + domainSuffix);
  const label = domain.endsWith(domainSuffix) ? domain.slice(0, -domainSuffix.length) : '';
  return label && !reservedLabels.has(label) && asciiLabel.test(label) ? label as SubjectLabel : null;
};

/** Decode an already validated label for visible text.
 * @example subjectDisplayName(parseSubjectLabel('日本語')!) // '日本語'
 */
export const subjectDisplayName = (label: SubjectLabel) =>
  domainToUnicode(label + domainSuffix).slice(0, -domainSuffix.length);

/** Match a supported site hostname. A subject is always exactly one DNS label.
 * @example matchSiteHost('toaster.localhost') // { kind: 'advisory', base: 'localhost', label: 'toaster' }
 */
export const matchSiteHost = (hostname: string) => {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if (host === '127.0.0.1') return { kind: 'redirect', base: 'localhost' } as const;
  const base = host === 'localhost' || host.endsWith('.localhost') ? 'localhost' : '2shell.cc';

  if (host === base) return { kind: 'home', base } as const;
  if (host.endsWith('.' + base)) {
    const subdomain = host.slice(0, -(base.length + 1));
    if (reservedLabels.has(subdomain)) return { kind: 'redirect', base } as const;
    const label = parseSubjectLabel(subdomain);
    if (label) return { kind: 'advisory', base, label } as const;
  }
  return { kind: 'unknown' } as const;
};

/** Build a canonical site URL using either the production zone or the current loopback port.
 * @example siteUrl(new URL('http://localhost:4321/'), 'localhost', '/ja').href
 */
export const siteUrl = (
  requestUrl: URL,
  base: 'localhost' | '2shell.cc',
  pathname: string,
  subject?: SubjectLabel,
) => {
  const hostname = subject ? subject + '.' + base : base;
  const origin = base === 'localhost'
    ? requestUrl.protocol + '//' + hostname + (requestUrl.port ? ':' + requestUrl.port : '')
    : 'https://' + hostname;
  const url = new URL(origin);
  url.pathname = pathname;
  return url;
};
