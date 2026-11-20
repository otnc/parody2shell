import assert from 'node:assert/strict';
import { request } from 'node:http';
import { test } from 'node:test';
import { designExampleLabels, designs, fourthEditionDesignIds } from '../src/advisories/designs.ts';
import { headlineSubjects, homeExamples } from '../src/advisories/examples.ts';
import { copyrightYears } from '../src/lib/copyright.ts';
import { parseSubjectLabel } from '../src/routing/hostname.ts';

const port = Number(process.env.TWOSHELL_TEST_PORT ?? '4321');
const socialTags = (html: string) => new Map(
  [...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)"/g)]
    .map(([, name, content]) => [name, content]),
);

const checkFooter = (html: string) => {
  const footer = html.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer);
  assert.match(footer, /href="https:\/\/github\.com\/otnc\/parody2shell">GitHub/);
  assert.match(footer, /href="https:\/\/github\.com\/otnc">otoneko\./);
  assert.ok(footer.includes(copyrightYears()));
};

const checkBadgeOnly = (html: string, language: 'en' | 'ja') => {
  assert.doesNotMatch(html, /\b(?:fictional|imaginary|jokes?)\b|架空|ジョーク|冗談/i);
  assert.equal(html.split(language === 'ja' ? 'パロディ' : 'Parody').length - 1, 1);
};

const checkSocial = (html: string, hostname: string, locale: 'en' | 'ja', title: string, type: 'article' | 'website') => {
  const tags = socialTags(html);
  const path = locale === 'ja' ? '/ja' : '/';
  const imagePath = locale === 'ja' ? '/ja/og.png' : '/og.png';
  const origin = 'http://' + hostname + ':' + port;
  assert.equal(tags.get('og:type'), type);
  assert.equal(tags.get('og:site_name'), 'parody2shell');
  assert.equal(tags.get('og:title'), title);
  assert.ok(tags.get('og:description'));
  assert.equal(tags.get('og:description'), tags.get('description'));
  assert.equal(tags.get('og:locale'), locale === 'ja' ? 'ja_JP' : 'en_US');
  assert.equal(tags.get('og:locale:alternate'), locale === 'ja' ? 'en_US' : 'ja_JP');
  assert.equal(tags.get('og:url'), origin + path);
  assert.equal(tags.get('og:image'), origin + imagePath + '?v=11');
  assert.equal(tags.get('og:image:type'), 'image/png');
  assert.equal(tags.get('og:image:width'), '1200');
  assert.equal(tags.get('og:image:height'), '630');
  assert.equal(tags.get('twitter:card'), 'summary_large_image');
  for (const property of ['title', 'description', 'image', 'image:alt']) {
    assert.ok(tags.get('og:' + property));
    assert.ok(tags.get('twitter:' + property));
  }
  assert.equal(tags.get('twitter:image'), tags.get('og:image'));
  assert.equal(tags.get('twitter:image:alt'), tags.get('og:image:alt'));
  return tags;
};

const checkShareIntent = (html: string, text: string, url: string) => {
  const href = html.match(/href="(https:\/\/twitter\.com\/intent\/tweet[^"]+)"/)?.[1];
  assert.ok(href);
  const intent = new URL(href.replaceAll('&amp;', '&'));
  assert.equal(intent.searchParams.get('text'), text);
  assert.equal(intent.searchParams.get('url'), url);
  assert.equal(intent.searchParams.get('hashtags'), 'parody2shell');
  assert.doesNotMatch(intent.searchParams.get('text') ?? '', /2shell\.cc/);
};

const get = (hostname: string, path: string) => new Promise<{
  status: number | undefined;
  headers: import('node:http').IncomingHttpHeaders;
  body: Buffer;
}>((resolve, reject) => {
  const req = request({ hostname: 'localhost', port, path, headers: { Host: hostname + ':' + port } }, (response) => {
    const chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => chunks.push(chunk));
    response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
    response.on('error', reject);
  });
  req.setTimeout(15_000, () => req.destroy(new Error('The local site did not respond.')));
  req.on('error', reject);
  req.end();
});

test('the top pages offer all styles and route Japanese input to the same locale', async () => {
  const devUrl = await get('127.0.0.1', '/ja?subject=toaster');
  assert.equal(devUrl.status, 301);
  assert.equal(devUrl.headers.location, 'http://localhost:' + port + '/ja?subject=toaster');
  const en = await get('localhost', '/');
  const ja = await get('localhost', '/ja');
  for (const [page, locale, title] of [[en, 'en', 'parody2shell | Security advisory generator'], [ja, 'ja', 'parody2shell｜脆弱性告知ジェネレーター']] as const) {
    const html = page.body.toString();
    assert.equal(page.status, 200);
    assert.match(html, /data-design="home"/);
    const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*\bdata-sample="/g)].map(([, href]) => href);
    const suffix = locale === 'ja' ? '/ja' : '/';
    assert.deepEqual(links, homeExamples.map(name => 'http://' + parseSubjectLabel(name) + '.localhost:' + port + suffix));
    assert.match(html, /<span class="sr-only">agent2shell lol<\/span>/);
    const serializedSubjects = html.match(/\bdata-subjects="([^"]+)"/)?.[1];
    assert.ok(serializedSubjects);
    assert.deepEqual(JSON.parse(serializedSubjects.replace(/&quot;|&#34;|&#x22;/g, '"')), headlineSubjects);
    assert.ok(html.includes('>' + (locale === 'ja' ? '貝' : 'react') + '2shell</strong>'));
    assert.ok(html.includes('>' + (locale === 'ja' ? '技術分析' : 'Technical Analysis') + '</span>'));
    assert.doesNotMatch(html, /<(?:link|style) [^>]*data-ui-library=/);
    checkShareIntent(html, title, 'http://localhost:' + port + (locale === 'ja' ? '/ja' : '/'));
    assert.match(html, /data-copy-url/);
    checkFooter(html);
    checkBadgeOnly(html, locale);
    assert.equal(checkSocial(html, 'localhost', locale, title, 'website').get('og:image:alt'), 'everything2shell');
  }
  assert.match(en.body.toString(), /name\.2shell\.cc/);
  const response = await get('localhost', '/ja?subject=' + encodeURIComponent('なでしこ'));
  assert.equal(response.status, 302);
  assert.equal(response.headers.location, 'http://' + parseSubjectLabel('なでしこ') + '.localhost:' + port + '/ja');
});

test('advisories use four distinct themes and expose the same name and CVE in both languages', async () => {
  const fixtures = [
    ['paperclip', 'paperclip', 'recall', 'retro', /<h2 id="recall-action">/],
    ['xn--wgv71a119e', '日本語', 'research', 'corporate', /<section [^>]*id="abstract">/],
    ['umbrella', 'umbrella', 'incident', 'night', /<dl [^>]*id="incident-status">/],
    ['toaster', 'toaster', 'maintainer', 'lofi', /<article [^>]*aria-labelledby="release-notes">/],
  ] as const;
  for (const [label, subject, design, theme, layoutSection] of fixtures) {
    const hostname = label + '.localhost';
    const en = await get(hostname, '/');
    const ja = await get(hostname, '/ja');
    const english = en.body.toString();
    const japanese = ja.body.toString();
    for (const [response, html, locale] of [[en, english, 'en'], [ja, japanese, 'ja']] as const) {
      assert.equal(response.status, 200);
      assert.ok(html.includes('data-theme="' + theme + '"'));
      assert.ok(html.includes('data-design="' + design + '"'));
      assert.match(html, layoutSection);
      for (const [, , otherDesign, , otherLayoutSection] of fixtures) {
        if (otherDesign !== design) assert.doesNotMatch(html, otherLayoutSection);
      }
      assert.ok(html.includes(subject + '2shell'));
      assert.ok(html.includes(designs[design].publication[locale]));
      assert.match(html, /data-copy-url/);
      checkShareIntent(html, subject + '2shell | parody2shell', 'http://' + hostname + ':' + port + (locale === 'ja' ? '/ja' : '/'));
      checkFooter(html);
      checkBadgeOnly(html, locale);
      checkSocial(html, hostname, locale, subject + '2shell | parody2shell', 'article');
    }
    assert.ok(english.includes(subject + ' can unexpectedly'));
    assert.ok(japanese.includes(subject + 'では、'));
    const cve = english.match(/CVE-2026-\d+/)?.[0];
    assert.ok(cve && japanese.includes(cve));
  }
});

test('www redirects even asset paths and localized 404 pages have no share controls', async () => {
  for (const reserved of ['www', 'parody', 'everything', 'xn--dckud3a9h']) {
    const redirect = await get(reserved + '.localhost', '/ja?x=2');
    assert.equal(redirect.status, 301, reserved);
    assert.equal(redirect.headers.location, 'http://localhost:' + port + '/ja?x=2');
  }
  const asset = await get('www.localhost', '/fonts/noto-sans-jp-regular.otf');
  assert.equal(asset.status, 301);
  assert.equal(asset.headers.location, 'http://localhost:' + port + '/fonts/noto-sans-jp-regular.otf');
  const missing = await get('toaster.localhost', '/ja/missing');
  assert.equal(missing.status, 404);
  const html = missing.body.toString();
  assert.match(html, /ページが見つかりません/);
  assert.match(html, /告知へ戻る/);
  assert.doesNotMatch(html, /data-copy-url|twitter\.com\/intent\/tweet/);
  checkFooter(html);
});

test('the new advisory themes render distinct components and load one local UI library apiece', async () => {
  const layoutMarkers = {
    newswire: ['news-edition', 'message-header'],
    issue: ['issue-thread', 'Box-body'],
    manual: ['field-manual', 'manual-checklist'],
    terminal: ['terminal-transcript', 'terminal-card'],
    'property-sheet': ['utility-window', 'status-bar-field'],
    wire: ['wire-feed', 'list-group-item'],
    notebook: ['observation-notebook', 'notebook-margin'],
    register: ['registry-record', 'panel-footer'],
    monitor: ['service-monitor', 'monitor-metrics'],
    arcade: ['arcade-board', 'nes-container'],
    helpdesk: ['help-article', 'uk-card-default'],
    briefing: ['briefing-deck', 'large-round'],
    departures: ['departure-board', 'pure-table-horizontal'],
    dossier: ['archive-dossier', 'marginnote'],
    exhibit: ['exhibit-label', 'exhibit-commentary'],
    claim: ['claim-office', 'button-outline'],
    exchange: ['incident-exchange', 'label success'],
    knowledge: ['knowledge-base', 'knowledge-index'],
    postcard: ['postcard-alert', 'postcard-stamp'],
    classifieds: ['classified-notice', 'tag is-small'],
    scanner: ['quarantine-scanner', 'data-augmented-ui'],
    spectrum: ['activation-spectrum', 'charts-css column'],
    filmstrip: ['evidence-filmstrip', 'splide__slide'],
    'relationship-map': ['incident-relationship-map', 'data-map-viewport'],
    walkthrough: ['guided-case-review', 'data-review-stop'],
  } as const;
  for (const [design, [id, libraryClass]] of Object.entries(layoutMarkers) as [keyof typeof layoutMarkers, readonly [string, string]][]) {
    const name = designExampleLabels[design];
    const label = parseSubjectLabel(name);
    assert.ok(label);
    const hostname = label + '.localhost';
    const english = await get(hostname, '/');
    const japanese = await get(hostname, '/ja');
    for (const [page, locale] of [[english, 'en'], [japanese, 'ja']] as const) {
      assert.equal(page.status, 200);
      const html = page.body.toString();
      assert.ok(html.includes('id="' + id + '"'));
      assert.ok(html.includes(libraryClass));
      assert.ok(html.includes('parody2shell / ' + designs[design].publication[locale]));
      assert.equal([...html.matchAll(/<(?:link|style) [^>]*data-ui-library=/g)].length, 1);
      const stylesheet = html.match(/<link rel="stylesheet" href="([^"]+)" data-ui-library="[^"]+"/)?.[1];
      if (stylesheet) {
        assert.ok(stylesheet.startsWith('/'));
        if (page === english) {
          const css = await get(hostname, stylesheet);
          assert.equal(css.status, 200);
          assert.match(css.headers['content-type'] ?? '', /^text\/css\b/);
          assert.ok(css.body.length > 1000);
        }
      } else {
        const inline = html.match(/<style [^>]*data-ui-library="[^"]+"[^>]*>([\s\S]*?)<\/style>/)?.[1];
        assert.ok(inline && inline.length > 1000);
      }
      assert.match(html, /data-copy-url/);
      assert.match(html, /data-icon="copy" data-icon-set="[^"]+"/);
      assert.match(html, /data-display-font="[^"]+"/);
      checkFooter(html);
      checkBadgeOnly(html, locale);
      const tags = checkSocial(html, hostname, locale, name + '2shell | parody2shell', 'article');
      assert.match(tags.get('og:image:alt') ?? '', /CVE-2026-[1-9]\d{12,13}$/);
    }
    for (const path of ['/og.png?v=11', '/ja/og.png?v=11']) {
      const card = await get(hostname, path);
      assert.equal(card.status, 200, design + ' ' + path);
      assert.equal(card.body.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(card.body.readUInt32BE(16), 1200);
      assert.equal(card.body.readUInt32BE(20), 630);
    }
  }
});

test('fourth-edition themes render their case-file layouts, scripts and social cards', async () => {
  const themes = {
    broadcast: ['broadcast-interruption', 'data-transcript', null],
    blueprint: ['blueprint-foldout', 'data-case-form="flow"', 'rough-notation'],
    fax: ['fax-spool', 'data-fax-page', null],
    bestiary: ['bestiary-field-guide', 'data-case-form="versions"', 'page-flip'],
    preprint: ['preprint-report', 'class="abstract"', null],
    bios: ['firmware-setup', 'tui-fieldset', null],
    wizard: ['update-wizard', 'title-bar-controls', null],
    'process-table': ['process-table', 'box-="square"', null],
    whiteboard: ['incident-whiteboard', 'data-rough-chart', 'roughjs'],
    observatory: ['observatory-bulletin', 'data-observatory-charts', 'chartist'],
    kanban: ['triage-board', 'nb-card', null],
    ceremony: ['fix-ceremony', 'data-case-form="timeline"', 'fireworks'],
  } as const satisfies Record<(typeof fourthEditionDesignIds)[number], readonly [string, string, string | null]>;
  const styledThemes = new Set<string>(['broadcast', 'preprint', 'bios', 'wizard', 'process-table', 'observatory', 'kanban']);
  for (const [design, [id, marker, script]] of Object.entries(themes) as [keyof typeof themes, readonly [string, string, string | null]][]) {
    const hostname = parseSubjectLabel(designs[design].example) + '.localhost';
    for (const locale of ['en', 'ja'] as const) {
      const page = await get(hostname, locale === 'ja' ? '/ja' : '/');
      assert.equal(page.status, 200, design);
      const html = page.body.toString();
      assert.ok(html.includes('data-design="' + design + '"'));
      assert.ok(html.includes('id="' + id + '"'), design);
      assert.ok(html.includes(marker), design + ' ' + marker);
      assert.ok(html.includes(designs[design].example + '2shell'));
      assert.match(html, /CVE-2026-[1-9]\d{12,13}/);
      assert.doesNotMatch(html, /\{(?:hits|trials|version|fixed|baseline|rate)\}/);
      assert.equal([...html.matchAll(/<(?:link|style) [^>]*data-ui-library=/g)].length, styledThemes.has(design) ? 1 : 0, design);
      if (script) assert.ok(html.includes('/client/' + script + '.js'), design);
      checkShareIntent(html, designs[design].example + '2shell | parody2shell', 'http://' + hostname + ':' + port + (locale === 'ja' ? '/ja' : '/'));
      checkFooter(html);
      checkBadgeOnly(html, locale);
    }
    for (const path of ['/og.png?v=11', '/ja/og.png?v=11']) {
      const card = await get(hostname, path);
      assert.equal(card.status, 200, design + ' ' + path);
      assert.equal(card.body.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    }
  }
  for (const script of ['rough-notation', 'roughjs', 'chartist', 'page-flip', 'fireworks']) {
    const asset = await get('localhost', '/client/' + script + '.js');
    assert.equal(asset.status, 200, script);
    assert.ok(asset.body.length > 5_000, script);
  }
});

test('interactive themes serve self-contained browser modules', async () => {
  const scripts = [
    ['film-reel', 'splide', 'Splide'],
    ['magnetic-board', 'panzoom', 'Panzoom'],
    ['magnifier', 'driver', 'driver'],
  ] as const;
  for (const [name, script, symbol] of scripts) {
    const path = '/client/' + script + '.js';
    const host = name + '.localhost';
    const page = await get(host, '/ja');
    assert.equal(page.status, 200);
    assert.ok(page.body.toString().includes(path));
    const asset = await get(host, path);
    assert.equal(asset.status, 200);
    assert.match(asset.headers['content-type'] ?? '', /(java|ecma)script/i);
    assert.ok(asset.body.length > 1_000);
    assert.ok(asset.body.toString().includes(symbol));
  }
});

test('the top and advisory social cards are real localized 1200×630 PNGs', async () => {
  const existingThemes = ['react', 'なでしこ', 'python', 'typescript'].map(name => parseSubjectLabel(name) + '.localhost');
  for (const hostname of ['localhost', ...existingThemes, 'a'.repeat(63) + '.localhost']) {
    const english = await get(hostname, '/og.png');
    const japanese = await get(hostname, '/ja/og.png');
    for (const image of [english, japanese]) {
      assert.equal(image.status, 200);
      assert.match(image.headers['content-type'] ?? '', /^image\/png\b/);
      assert.equal(image.body.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(image.body.readUInt32BE(16), 1200);
      assert.equal(image.body.readUInt32BE(20), 630);
    }
    assert.notDeepEqual(english.body, japanese.body);
  }
});

test('OGP preview paths serve the same localized PNG as the metadata endpoints', async () => {
  for (const hostname of ['localhost', 'apache.localhost', parseSubjectLabel('貝') + '.localhost']) {
    for (const prefix of ['', '/ja']) {
      const preview = await get(hostname, prefix + '/ogp');
      const image = await get(hostname, prefix + '/og.png');
      assert.equal(preview.status, 200);
      assert.equal(image.status, 200);
      assert.match(preview.headers['content-type'] ?? '', /^image\/png\b/);
      assert.deepEqual(preview.body, image.body);
    }
  }
});

test('social previews keep the full Open Graph title and respect X title limits', async () => {
  const label = 'a'.repeat(63);
  const host = label + '.localhost';
  const page = await get(host, '/');
  assert.equal(page.status, 200);
  const tags = checkSocial(page.body.toString(), host, 'en', label + '2shell | parody2shell', 'article');
  assert.equal(Array.from(tags.get('twitter:title') ?? '').length, 70);
  assert.ok(Array.from(tags.get('twitter:description') ?? '').length <= 200);
  const react = await get('react.localhost', '/og.png?v=11');
  const paperclip = await get('paperclip.localhost', '/og.png?v=11');
  assert.equal(react.status, 200);
  assert.equal(paperclip.status, 200);
  assert.notDeepEqual(react.body, paperclip.body);
});

test('social cards are cacheable, survive crawler query strings and name everything on the top page', async () => {
  const first = await get('kettle.localhost', '/og.png?v=11');
  const second = await get('kettle.localhost', '/og.png?v=11&utm_source=crawler');
  for (const card of [first, second]) {
    assert.equal(card.status, 200);
    assert.match(card.headers['content-type'] ?? '', /^image\/png\b/);
    assert.match(card.headers['cache-control'] ?? '', /s-maxage=604800/);
    assert.equal(Number(card.headers['content-length']), card.body.length);
  }
  assert.deepEqual(first.body, second.body);
  const head = await new Promise<number | undefined>((resolve, reject) => {
    const req = request({ hostname: 'localhost', port, path: '/ja/og.png?v=11', method: 'HEAD', headers: { Host: 'kettle.localhost:' + port } }, response => resolve(response.statusCode));
    req.on('error', reject);
    req.end();
  });
  assert.equal(head, 200);
});

test('social cards render emoji and non-Japanese scripts without failing', async () => {
  for (const name of ['🤩', '猫😺', '❤️🔥', '🇯🇵', '한국어', 'مرحبا', 'ไทย', 'हिन्दी', 'ქართული', '∑≈∞♞']) {
    const label = parseSubjectLabel(name);
    assert.ok(label, name);
    for (const path of ['/og.png?v=11', '/ja/og.png?v=11']) {
      const card = await get(label + '.localhost', path);
      assert.equal(card.status, 200, name + ' ' + path);
      assert.equal(card.body.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    }
  }
});
