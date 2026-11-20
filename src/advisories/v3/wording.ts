import { scenarios } from '../v2/scenarios.ts';
import { affectedInstallations, summaryForms, workarounds } from '../v2/slots.ts';
import { bureauScenarios } from './bureau.ts';
import { curiositiesScenarios } from './curiosities.ts';
import { devicesScenarios } from './devices.ts';
import { faultsScenarios } from './faults.ts';
import { mechanicsScenarios } from './mechanics.ts';
import { placesScenarios } from './places.ts';
import { formalDetails, playfulDetails } from './details.ts';
import { additionalAffected, additionalSummaries, additionalWorkarounds, followups, reviewNotes } from './slots.ts';

const formalScenarios = [...faultsScenarios, ...mechanicsScenarios];
const formalScenarioIds = new Set(formalScenarios.map(({ id }) => id));
export const expandedScenarios = [...scenarios, ...placesScenarios, ...devicesScenarios, ...bureauScenarios, ...curiositiesScenarios, ...formalScenarios];
const triggers = expandedScenarios.flatMap(scenario => scenario.triggers.map(trigger => ({ scenario, trigger })));
const installations = [...affectedInstallations, ...additionalAffected];
const mitigations = [...workarounds, ...additionalWorkarounds];
const summaries = [...summaryForms, ...additionalSummaries];
const detailCount = Math.min(formalDetails.length, playfulDetails.length);
const dimensions = [triggers, installations, mitigations, summaries, reviewNotes, followups];
export const wordingCount = dimensions.reduce((product, choices) => product * choices.length, detailCount);

/** Decode a combination number. Distinct numbers select distinct sets of text slots.
 * @example wordingAt(0n)
 */
export const wordingAt = (seed: bigint) => {
  let rank = Number(seed % BigInt(wordingCount));
  const next = <T>(choices: readonly T[]) => {
    const selected = choices[rank % choices.length];
    rank = Math.floor(rank / choices.length);
    return selected;
  };
  const { scenario, trigger } = next(triggers);
  const affected = next(installations);
  const mitigation = next(mitigations);
  const summaryForm = next(summaries);
  const note = next(reviewNotes);
  const followup = next(followups);
  const detail = (formalScenarioIds.has(scenario.id) ? formalDetails : playfulDetails)[rank];
  return {
    scenario,
    trigger,
    affected,
    summaryForm,
    cause: { en: [scenario.cause.en, note.en, detail.en].join(' '), ja: scenario.cause.ja + note.ja + detail.ja },
    workaround: { en: mitigation.en + ' ' + followup.en, ja: mitigation.ja + followup.ja },
  };
};
