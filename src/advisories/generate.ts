import type { Locale, Localized } from '../i18n/messages.ts';
import { parseSubjectLabel, subjectDisplayName } from '../routing/hostname.ts';
import {
  designs, designExampleLabels, designIds, fourthEditionDesignIds, interactiveDesignIds,
  secondEditionDesignIds, thirdEditionDesignIds, type DesignId,
} from './designs.ts';
import { homeExamples, legacyHeadlineSubjects } from './examples.ts';
import { advisoryVisuals } from './visuals.ts';
import { designIds as legacyDesignIds } from './v1/designs.ts';
import { scenarios as legacyScenarios } from './v1/scenarios.ts';
import { affectedInstallations as legacyAffected, workarounds as legacyWorkarounds } from './v1/slots.ts';
import { scenarios } from './v2/scenarios.ts';
import { affectedInstallations, summaryForms, workarounds } from './v2/slots.ts';
import { wordingAt } from './v3/wording.ts';
import { caseEvidenceFormats } from './v4/case.ts';
import { severityProfiles } from './v4/severity.ts';
import { caseWordingAt } from './v4/wording.ts';

type SubjectLabel = NonNullable<ReturnType<typeof parseSubjectLabel>>;
const encoder = new TextEncoder();

const digestFor = async (label: SubjectLabel, slot: string, edition: 'v1' | 'v2' | 'v3' | 'v4') =>
  new DataView(await crypto.subtle.digest('SHA-256', encoder.encode(edition + ':' + slot + ':' + label)));

const indexFrom = (digest: DataView, size: number) => digest.getUint32(0) % size;
const legacyEvidenceFormats = ['table', 'bar', 'combined', 'line', 'none'] as const;
const thirdEditionEvidenceFormats = [...legacyEvidenceFormats, 'ring', 'matrix', 'table-line'] as const;
export const evidenceFormats = [...thirdEditionEvidenceFormats, ...caseEvidenceFormats] as const;
export type EvidenceFormat = typeof evidenceFormats[number];

// Frozen sizes: the third-edition layout bucket had 29 themes, and the fourth edition draws from 41 slots.
// Appending themes later must not change these numbers; add another bucket instead.
const thirdEditionLayoutBucket = 29;
const fourthEditionLayoutBucket = 41;

const exampleDesigns = new Map<SubjectLabel | null, DesignId>(designIds.flatMap(design => [
  [parseSubjectLabel(designs[design].example), design] as const,
  ...(design in designExampleLabels ? [[parseSubjectLabel(designExampleLabels[design as keyof typeof designExampleLabels]), design] as const] : []),
]));
const legacyExamples = new Set(legacyDesignIds.map((design) => parseSubjectLabel(designs[design].example)));
const secondEditionExamples = new Set(secondEditionDesignIds.map((design) => parseSubjectLabel(designs[design].example)));
const fourthEditionDesigns = new Set<DesignId>(fourthEditionDesignIds);
// Published names keep every choice they had before the fourth edition.
const frozenLabels = new Set([...homeExamples, ...legacyHeadlineSubjects].map(name => parseSubjectLabel(name)));

const thirdEditionDesign = async (label: SubjectLabel): Promise<DesignId> => {
  const layout = await digestFor(label, 'layout', 'v3');
  const interactive = layout.getUint32(4) % thirdEditionLayoutBucket;
  return interactiveDesignIds[interactive] ?? thirdEditionDesignIds[indexFrom(layout, thirdEditionDesignIds.length)];
};

/** Resolve the presentation without generating the advisory body.
 * @example await designForLabel(parseSubjectLabel('react')!)
 */
export const designForLabel = async (label: SubjectLabel): Promise<DesignId> => {
  const example = exampleDesigns.get(label);
  if (example) return example;
  const previous = await thirdEditionDesign(label);
  if (frozenLabels.has(label)) return previous;
  const bucket = await digestFor(label, 'layout', 'v4');
  return fourthEditionDesignIds[bucket.getUint32(0) % fourthEditionLayoutBucket] ?? previous;
};

/** Fourth-edition themes need the detailed case files; other new labels take them half of the time. */
const usesCaseFiles = async (label: SubjectLabel, design: DesignId) => {
  if (fourthEditionDesigns.has(design)) return true;
  if (frozenLabels.has(label) || exampleDesigns.has(label)) return false;
  return (await digestFor(label, 'catalog', 'v4')).getUint32(0) % 2 === 0;
};

type Wording = {
  scenario: { id: string; score: keyof typeof severityProfiles };
  trigger: Localized; cause: Localized; affected: Localized; workaround: Localized; summaryForm: Localized;
};

const isoDay = (start: number, offsetDays: number) => new Date(start + offsetDays * 86_400_000).toISOString().slice(0, 10);

/** Build the deterministic advisory from a normalized label.
 * @example await generateAdvisory(parseSubjectLabel('toaster')!)
 */
export const generateAdvisory = async (label: SubjectLabel) => {
  const isLegacy = legacyExamples.has(label);
  const edition = isLegacy ? 'v1' : 'v2';
  const availableScenarios = isLegacy ? legacyScenarios : scenarios;
  const availableAffected = isLegacy ? legacyAffected : affectedInstallations;
  const availableWorkarounds = isLegacy ? legacyWorkarounds : workarounds;
  const availableEvidence = isLegacy ? legacyEvidenceFormats : thirdEditionEvidenceFormats;
  const [design, wordingDigest, styleDigest, cve, evidence] = await Promise.all([
    designForLabel(label),
    digestFor(label, 'wording', 'v3'),
    digestFor(label, 'visuals', 'v3'),
    digestFor(label, 'cve', 'v1'),
    digestFor(label, 'evidence', edition),
  ]);
  const subject = subjectDisplayName(label);
  const activations = 21 + evidence.getUint8(4) % 16;
  const release = 1 + evidence.getUint8(5) % 3;
  const minor = 1 + evidence.getUint8(6) % 8;
  const trials = 40;
  const affectedVersion = [release, minor, 0].join('.');
  const fixedVersion = [release, minor, 1].join('.');
  const baselineVersion = minor > 1 ? [release, minor - 1, 3].join('.') : [release - 1, 9, 3].join('.');
  const observedOn = Date.UTC(2026, evidence.getUint8(7) % 9, 1 + evidence.getUint8(8) % 26);
  const isolatedAfter = 2 + evidence.getUint8(9) % 4;
  const comparedAfter = isolatedAfter + 1 + evidence.getUint8(10) % 3;
  const publishedAfter = comparedAfter + 1 + evidence.getUint8(11) % 4;

  let wording: Wording = wordingAt(wordingDigest.getBigUint64(0));
  let investigation: null | {
    family: string; component: Localized; expected: Localized; observed: Localized;
    comparison: Localized; conditions?: Localized; note: Localized;
  } = null;
  let format: EvidenceFormat;
  if (await usesCaseFiles(label, design)) {
    const [caseDigest, formatDigest] = await Promise.all([digestFor(label, 'wording', 'v4'), digestFor(label, 'evidence', 'v4')]);
    const selected = caseWordingAt((caseDigest.getBigUint64(0) << 64n) | caseDigest.getBigUint64(8));
    const values: Record<string, string> = {
      hits: String(activations), trials: String(trials), rate: String(Math.round(activations * 100 / trials)),
      version: affectedVersion, fixed: fixedVersion, baseline: baselineVersion,
    };
    const fill = (text: Localized): Localized => ({
      en: text.en.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? subject),
      ja: text.ja.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? subject),
    });
    const { scenario } = selected;
    investigation = {
      family: scenario.family,
      component: scenario.component,
      expected: fill(scenario.expected),
      observed: fill(scenario.observed),
      comparison: fill(scenario.comparison),
      ...(scenario.conditions && { conditions: fill(scenario.conditions) }),
      note: selected.note,
    };
    // Each family lists the evidence forms its data fits; the generic table and line chart fit all of them.
    const compatible = [...scenario.formats, 'table-line'] as const;
    format = compatible[indexFrom(formatDigest, compatible.length)];
    wording = { ...selected, cause: fill(selected.cause) };
  } else {
    if (secondEditionExamples.has(label)) {
      const [scenarioDigest, trigger, affected, workaround, summary] = await Promise.all(
        ['template', 'trigger', 'affected', 'mitigation', 'summary'].map(slot => digestFor(label, slot, edition)),
      );
      const scenario = availableScenarios[indexFrom(scenarioDigest, availableScenarios.length)];
      wording = {
        scenario,
        trigger: scenario.triggers[indexFrom(trigger, scenario.triggers.length)],
        cause: scenario.cause,
        affected: availableAffected[indexFrom(affected, availableAffected.length)],
        workaround: availableWorkarounds[indexFrom(workaround, availableWorkarounds.length)],
        summaryForm: isLegacy ? summaryForms[0] : summaryForms[indexFrom(summary, summaryForms.length)],
      };
    }
    format = availableEvidence[indexFrom(evidence, availableEvidence.length)];
  }

  const serial = cve.getBigUint64(0) % 10_000_000_000_000n;
  // Keep the existing suffix where possible, reserving 13 or more digits for generated IDs.
  const advisoryNumber = serial < 1_000_000_000_000n ? serial + 10_000_000_000_000n : serial;
  return {
    label,
    subject,
    title: subject + '2shell',
    design,
    ...advisoryVisuals(design, styleDigest),
    edition: investigation ? 'v4' as const : 'v3' as const,
    scenarioId: wording.scenario.id,
    trigger: wording.trigger,
    cause: wording.cause,
    affected: wording.affected,
    workaround: wording.workaround,
    summaryForm: wording.summaryForm,
    investigation,
    cve: 'CVE-2026-' + advisoryNumber,
    severity: severityProfiles[wording.scenario.score],
    evidence: {
      format,
      trials,
      counts: [0, activations, 0] as const,
      rounds: [activations, activations - 7, activations - 10, 8, 3, 0] as const,
      affectedVersion,
      fixedVersion,
      baselineVersion,
      timeline: {
        observed: isoDay(observedOn, 0),
        isolated: isoDay(observedOn, isolatedAfter),
        compared: isoDay(observedOn, comparedAfter),
        published: isoDay(observedOn, publishedAfter),
      },
    },
  };
};

export type Advisory = Awaited<ReturnType<typeof generateAdvisory>>;

/** Render one language using the same selected data for the page and social metadata.
 * @example advisorySummary(advisory, 'ja')
 */
export const advisorySummary = (advisory: Advisory, locale: Locale) =>
  advisory.summaryForm[locale]
    .replace('{subject}', () => advisory.subject)
    .replace('{trigger}', () => advisory.trigger[locale]);
