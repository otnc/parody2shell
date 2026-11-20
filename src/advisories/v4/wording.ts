import { affectedInstallations, summaryForms, workarounds } from '../v2/slots.ts';
import { formalDetails, playfulDetails } from '../v3/details.ts';
import { additionalAffected, additionalSummaries, additionalWorkarounds, followups } from '../v3/slots.ts';
import type { CaseFile } from './case.ts';
import { catalogFamily } from './families/catalog.ts';
import { dispatchFamily } from './families/dispatch.ts';
import { gardenFamily } from './families/garden.ts';
import { instrumentsFamily } from './families/instruments.ts';
import { kitchenFamily } from './families/kitchen.ts';
import { playFamily } from './families/play.ts';
import { signalFamily } from './families/signal.ts';
import { surveyFamily } from './families/survey.ts';
import { toolingFamily } from './families/tooling.ts';
import { transitFamily } from './families/transit.ts';
import { caseAffected, caseFollowups, caseMitigations, caseSummaries, evidenceNotes } from './slots.ts';

// Published order determines the case assigned to each label.
export const caseFamilies = [
  signalFamily, surveyFamily, kitchenFamily, dispatchFamily, catalogFamily,
  transitFamily, instrumentsFamily, playFamily, gardenFamily, toolingFamily,
] as const;
export const caseFiles: readonly CaseFile[] = caseFamilies.flatMap(({ cases }) => cases);

const triggers = caseFiles.flatMap(scenario => scenario.triggers.map(trigger => ({ scenario, trigger })));
const installations = [...caseAffected, ...affectedInstallations, ...additionalAffected];
const mitigations = [...caseMitigations, ...workarounds, ...additionalWorkarounds];
const nextSteps = [...caseFollowups, ...followups];
const summaries = [...caseSummaries, ...summaryForms, ...additionalSummaries];
// Each tone draws from its own detail list, so both lists must be the same length for the radix to stay exact.
const detailCount = Math.min(formalDetails.length, playfulDetails.length);
const dimensions = [triggers, installations, mitigations, nextSteps, summaries, evidenceNotes];

/** The exact number of distinct fourth-edition wordings. */
export const caseWordingCount = dimensions.reduce((product, choices) => product * BigInt(choices.length), BigInt(detailCount));

/** Decode a combination number with BigInt arithmetic so no step is limited to 53 bits.
 * @example caseWordingAt(0n).scenario.id
 */
export const caseWordingAt = (seed: bigint) => {
  let rank = seed % caseWordingCount;
  const next = <T>(choices: readonly T[]) => {
    const size = BigInt(choices.length);
    const selected = choices[Number(rank % size)];
    rank /= size;
    return selected;
  };
  const { scenario, trigger } = next(triggers);
  const affected = next(installations);
  const mitigation = next(mitigations);
  const followup = next(nextSteps);
  const summaryForm = next(summaries);
  const note = next(evidenceNotes);
  const detail = (scenario.tone === 'deadpan' ? formalDetails : playfulDetails)[Number(rank)];
  return {
    scenario,
    trigger,
    affected,
    summaryForm,
    note,
    cause: { en: scenario.cause.en + ' ' + detail.en, ja: scenario.cause.ja + detail.ja },
    workaround: { en: mitigation.en + ' ' + followup.en, ja: mitigation.ja + followup.ja },
  };
};
