import type { Localized } from '../../i18n/messages.ts';
import type { severityProfiles } from './severity.ts';

/** Evidence forms that a fourth-edition record can be rendered with. */
export const caseEvidenceFormats = ['versions', 'trace', 'timeline', 'flow'] as const;
export type CaseEvidenceFormat = typeof caseEvidenceFormats[number];

type Pair = readonly [english: string, japanese: string];
export type Tone = 'deadpan' | 'absurd';

/**
 * A fully authored scenario. The text may use {hits}, {trials}, {rate}, {version}, {fixed} and
 * {baseline}; the generator fills them from the same record that feeds the tables and charts.
 */
export type CaseFile = {
  id: string;
  family: string;
  score: keyof typeof severityProfiles;
  tone: Tone;
  cause: Localized;
  expected: Localized;
  observed: Localized;
  comparison: Localized;
  conditions?: Localized;
  triggers: readonly [Localized, ...Localized[]];
  component: Localized;
  formats: readonly CaseEvidenceFormat[];
};

export type Family = {
  id: string;
  component: Localized;
  formats: readonly CaseEvidenceFormat[];
  cases: readonly CaseFile[];
};

const localize = ([en, ja]: Pair): Localized => ({ en, ja });

type Draft = {
  id: string;
  score: CaseFile['score'];
  tone: Tone;
  cause: Pair;
  expected: Pair;
  observed: Pair;
  comparison: Pair;
  conditions?: Pair;
  triggers: readonly [Pair, ...Pair[]];
};

/** Author one case in reading order: premise, expected behavior, observation, follow-up comparison.
 * @example draft('chime', 'local', 'deadpan', cause, expected, observed, comparison, [trigger])
 */
export const draft = (
  id: string, score: Draft['score'], tone: Tone,
  cause: Pair, expected: Pair, observed: Pair, comparison: Pair,
  triggers: Draft['triggers'], conditions?: Pair,
): Draft => ({ id, score, tone, cause, expected, observed, comparison, triggers, conditions });

/** Group cases that share a component and compatible evidence forms.
 * @example family('signal', ['the console', '放送卓'], ['trace'], [])
 */
export const family = (id: string, component: Pair, formats: readonly CaseEvidenceFormat[], drafts: readonly Draft[]): Family => ({
  id,
  component: localize(component),
  formats,
  cases: drafts.map(draft => ({
    id: draft.id,
    family: id,
    score: draft.score,
    tone: draft.tone,
    cause: localize(draft.cause),
    expected: localize(draft.expected),
    observed: localize(draft.observed),
    comparison: localize(draft.comparison),
    ...(draft.conditions && { conditions: localize(draft.conditions) }),
    triggers: [localize(draft.triggers[0]), ...draft.triggers.slice(1).map(localize)],
    component: localize(component),
    formats,
  })),
});
