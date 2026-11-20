import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchSiteHost, parseSubjectLabel, siteUrl } from '../src/routing/hostname.ts';

test('a subject occupies exactly one valid DNS label', () => {
  assert.equal(parseSubjectLabel('日本語'), 'xn--wgv71a119e');
  assert.equal(parseSubjectLabel('PAPERCLIP'), 'paperclip');
  assert.equal(parseSubjectLabel('123'), '123');
  assert.equal(parseSubjectLabel('a'.repeat(63)), 'a'.repeat(63));
  for (const invalid of ['ｗｗｗ', 'www', 'parody', 'PARODY', 'everything', 'パロディ', 'xn--dckud3a9h', 'one.two', 'one。two', 'a/b', 'a@b', '-a', 'a-', 'xn--', 'a'.repeat(64)]) {
    assert.equal(parseSubjectLabel(invalid), null, invalid);
  }
});

test('the apex, reserved www/parody labels and unrelated hosts have separate routing outcomes', () => {
  assert.deepEqual(matchSiteHost('2shell.cc'), { kind: 'home', base: '2shell.cc' });
  assert.deepEqual(matchSiteHost('www.2shell.cc'), { kind: 'redirect', base: '2shell.cc' });
  assert.deepEqual(matchSiteHost('www.localhost'), { kind: 'redirect', base: 'localhost' });
  assert.deepEqual(matchSiteHost('parody.2shell.cc'), { kind: 'redirect', base: '2shell.cc' });
  assert.deepEqual(matchSiteHost('xn--dckud3a9h.2shell.cc'), { kind: 'redirect', base: '2shell.cc' });
  assert.deepEqual(matchSiteHost('parody.localhost'), { kind: 'redirect', base: 'localhost' });
  assert.deepEqual(matchSiteHost('everything.2shell.cc'), { kind: 'redirect', base: '2shell.cc' });
  assert.deepEqual(matchSiteHost('xn--dckud3a9h.localhost'), { kind: 'redirect', base: 'localhost' });
  assert.deepEqual(matchSiteHost('x.y.2shell.cc'), { kind: 'unknown' });
  assert.deepEqual(matchSiteHost('2shell.cc.example.org'), { kind: 'unknown' });
});

test('links keep the requested language and the local port', () => {
  const label = parseSubjectLabel('日本語');
  assert.ok(label);
  assert.equal(
    siteUrl(new URL('http://localhost:4321'), 'localhost', '/ja/og.png', label).href,
    'http://xn--wgv71a119e.localhost:4321/ja/og.png',
  );
  assert.equal(siteUrl(new URL('http://www.2shell.cc'), '2shell.cc', '/ja').href, 'https://2shell.cc/ja');
  assert.equal(
    siteUrl(new URL('http://react.2shell.cc'), '2shell.cc', '/ja/og.png', parseSubjectLabel('react')!).href,
    'https://react.2shell.cc/ja/og.png',
  );
});
