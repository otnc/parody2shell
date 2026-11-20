import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advisorySummary, generateAdvisory } from '../src/advisories/generate.ts';
import { designs, designIds, fourthEditionDesignIds } from '../src/advisories/designs.ts';
import { headlineSubjects, homeExamples, homeHeadline } from '../src/advisories/examples.ts';
import { fonts, iconSets } from '../src/advisories/visuals.ts';
import { expandedScenarios, wordingAt, wordingCount } from '../src/advisories/v3/wording.ts';
import { caseFamilies, caseFiles, caseWordingAt, caseWordingCount } from '../src/advisories/v4/wording.ts';
import { copyrightYears } from '../src/lib/copyright.ts';
import { matchSiteHost, parseSubjectLabel, subjectDisplayName } from '../src/routing/hostname.ts';

test('Unicode, Punycode, production and localhost feed the same advisory', async () => {
  const hostnames = [
    '日本語.2shell.cc',
    'xn--wgv71a119e.2shell.cc',
    '日本語.localhost',
    'xn--wgv71a119e.localhost',
  ];
  const records = await Promise.all(hostnames.map(async (hostname) => {
    const host = matchSiteHost(hostname);
    assert.equal(host.kind, 'advisory');
    return generateAdvisory(host.label);
  }));
  const advisory = records[0];
  for (const record of records) assert.deepEqual(record, advisory);
  assert.equal(advisory.title, '日本語2shell');
  assert.match(advisorySummary(advisory, 'en'), /^日本語 can unexpectedly open a shell when /);
  assert.match(advisorySummary(advisory, 'ja'), /^日本語では、/);
  assert.equal(advisory.cve, 'CVE-2026-6186362937016');
  assert.equal(advisory.scenarioId, 'physical-controls');
  assert.equal(advisory.design, 'research');
  assert.equal(advisory.evidence.format, 'line');
  assert.deepEqual(advisory.evidence.counts, [0, 30, 0]);
});

test('each featured example keeps its published design and evidence choice', async () => {
  const examples = [
    { name: 'paperclip', design: 'recall', evidence: 'bar' },
    { name: '日本語', design: 'research', evidence: 'line' },
    { name: 'umbrella', design: 'incident', evidence: 'combined' },
    { name: 'toaster', design: 'maintainer', evidence: 'combined' },
  ];
  for (const example of examples) {
    const label = parseSubjectLabel(example.name);
    assert.ok(label);
    const advisory = await generateAdvisory(label);
    assert.equal(advisory.design, example.design);
    assert.equal(advisory.evidence.format, example.evidence);
  }
});

test('existing assignments outside the new theme bucket retain their layout and typography', async () => {
  const example = await generateAdvisory(parseSubjectLabel('goldfish')!);
  assert.equal(example.design, 'exchange');
  assert.equal(example.displayFont, 'space');
  assert.equal(example.bodyFont, 'manrope');
  const label = parseSubjectLabel('fuck')!;
  assert.equal((await generateAdvisory(label)).design, 'exchange');
});

test('the 36 requested homepage names are alphabetical before the Japanese examples', async () => {
  assert.deepEqual(homeExamples, [
    'agent', 'apache', 'bash', 'chrome', 'cobol', 'coffee', 'firefox', 'google', 'http', 'human',
    'java', 'javascript', 'line', 'linux', 'mac', 'microsoft', 'microwave', 'nextjs', 'nginx',
    'node', 'php', 'python', 'react', 'root', 'ruby', 'rust', 'shell', 'twitter', 'typescript',
    'vercel', 'windows', 'wordpress', 'zig', 'zsh', 'なでしこ', '貝',
  ]);
  assert.equal(homeHeadline, 'agent2shell lol');
  for (const name of homeExamples) {
    const advisory = await generateAdvisory(parseSubjectLabel(name)!);
    assert.equal(advisory.subject, name);
    assert.equal(advisory.title, name + '2shell');
    assert.match(advisory.cve, /^CVE-2026-[1-9]\d{12,13}$/);
  }
});

test('headline rotation includes the examples and additional names in alphabetical order', () => {
  assert.ok(headlineSubjects.length > homeExamples.length);
  assert.equal(new Set(headlineSubjects).size, headlineSubjects.length);
  assert.ok(homeExamples.every(name => headlineSubjects.includes(name)));
  assert.ok(headlineSubjects.includes('docker'));
  assert.ok(headlineSubjects.includes('web'));

  const alphabetical = headlineSubjects.filter(name => /^[a-z0-9-]+$/.test(name));
  const japaneseExamples = homeExamples.filter(name => !/^[a-z]+$/.test(name));
  assert.deepEqual(headlineSubjects, [...alphabetical.toSorted(), ...japaneseExamples]);
  for (const name of headlineSubjects) {
    const label = parseSubjectLabel(name);
    assert.ok(label);
    assert.equal(subjectDisplayName(label), name);
  }
});

test('the copyright range rolls over at midnight in Japan', () => {
  assert.equal(copyrightYears(new Date('2026-12-31T14:59:59Z')), '2026');
  assert.equal(copyrightYears(new Date('2026-12-31T15:00:00Z')), '2026-2027');
});

test('the expanded catalog reaches every layout, scenario, severity profile and evidence format', async () => {
  for (const design of designIds) {
    const label = parseSubjectLabel(designs[design].example);
    assert.ok(label);
    assert.equal((await generateAdvisory(label)).design, design);
  }
  const records = await Promise.all(Array.from({ length: 4096 }, (_, index) =>
    generateAdvisory(parseSubjectLabel('sample-' + index)!),
  ));
  assert.equal(new Set(records.map(({ design }) => design)).size, designIds.length);
  assert.equal(new Set(records.map(({ scenarioId }) => scenarioId)).size, expandedScenarios.length + caseFiles.length);
  assert.equal(new Set(records.map(({ severity }) => severity.vector)).size, 5);
  assert.equal(new Set(records.map(({ evidence }) => evidence.format)).size, 12);
  assert.equal(new Set(records.map(({ summaryForm }) => summaryForm.en)).size, 34);
  assert.equal(new Set(records.map(({ displayFont }) => displayFont)).size, Object.keys(fonts).length);
  assert.equal(new Set(records.map(({ iconSet }) => iconSet)).size, iconSets.length);
  assert.equal(new Set(expandedScenarios.map(({ id }) => id)).size, expandedScenarios.length);
  const wordings = records.map(({ scenarioId, trigger, cause, affected, workaround, summaryForm }) =>
    JSON.stringify([scenarioId, trigger.en, cause.en, affected.en, workaround.en, summaryForm.en])
  );
  assert.equal(new Set(wordings).size, records.length);
  for (const record of records) {
    for (const locale of ['en', 'ja'] as const) {
      const summary = advisorySummary(record, locale);
      assert.ok(summary.includes(record.subject));
      assert.ok(summary.includes(record.trigger[locale]));
      assert.doesNotMatch(summary, /\{subject\}|\{trigger\}/);
    }
  }
});

test('published names keep their pre-fourth-edition assignments', async () => {
  const fixtures = [
    ['agent', 'property-sheet', 'acknowledgment-state', 'table-line'],
    ['bash', 'terminal', 'heartbeat-encore', 'none'],
    ['cobol', 'dossier', 'sign-in-book', 'table'],
    ['popcorn', 'scanner', 'empty-log', 'table-line'],
    ['貝', 'walkthrough', 'checkpoint-generation', 'line'],
  ] as const;
  for (const [name, design, scenarioId, format] of fixtures) {
    const advisory = await generateAdvisory(parseSubjectLabel(name)!);
    assert.deepEqual([advisory.design, advisory.scenarioId, advisory.evidence.format, advisory.edition], [design, scenarioId, format, 'v3'], name);
  }
});

test('fourth-edition themes always carry a case file whose text matches its evidence', async () => {
  assert.equal(fourthEditionDesignIds.length, 12);
  assert.equal(caseFamilies.length, 10);
  assert.equal(new Set(caseFiles.map(({ id }) => id)).size, caseFiles.length);
  assert.equal(new Set([...caseFiles, ...expandedScenarios].map(({ id }) => id)).size, caseFiles.length + expandedScenarios.length);
  const records = await Promise.all(Array.from({ length: 1024 }, (_, index) => generateAdvisory(parseSubjectLabel('case-' + index)!)));
  for (const record of records) {
    if ((fourthEditionDesignIds as readonly string[]).includes(record.design)) assert.equal(record.edition, 'v4', record.label);
    if (!record.investigation) continue;
    const { observed, comparison, expected } = record.investigation;
    for (const locale of ['en', 'ja'] as const) {
      for (const text of [observed[locale], comparison[locale], expected[locale], record.cause[locale]]) {
        assert.doesNotMatch(text, /\{\w+\}/);
      }
      assert.ok(observed[locale].includes(String(record.evidence.counts[1])), record.label);
      assert.ok(observed[locale].includes(String(record.evidence.trials)), record.label);
      assert.ok(observed[locale].includes(record.evidence.affectedVersion), record.label);
      assert.ok(comparison[locale].includes(record.evidence.fixedVersion), record.label);
    }
    assert.ok(caseFiles.find(({ id }) => id === record.scenarioId)?.formats.includes(record.evidence.format as never) || record.evidence.format === 'table-line');
    const { observed: first, isolated, compared, published } = record.evidence.timeline;
    assert.ok(first < isolated && isolated < compared && compared < published);
  }
});

test('the fourth-edition wording space is exact and decoded without 53-bit limits', () => {
  assert.ok(caseWordingCount > 2n ** 32n);
  assert.ok(caseWordingCount < 2n ** 128n);
  assert.notDeepEqual(caseWordingAt(0n), caseWordingAt(2n ** 60n));
  assert.deepEqual(caseWordingAt(1n), caseWordingAt(caseWordingCount + 1n));
  assert.notDeepEqual(caseWordingAt(0n), caseWordingAt(caseWordingCount - 1n));
});

test('the combined wording space extends past 32 bits and wraps at its exact period', () => {
  assert.ok(wordingCount > 2 ** 32);
  assert.notDeepEqual(wordingAt(0n), wordingAt(2n ** 32n));
  assert.notDeepEqual(wordingAt(0n), wordingAt(BigInt(wordingCount - 1)));
  assert.deepEqual(wordingAt(0n), wordingAt(BigInt(wordingCount)));
});
