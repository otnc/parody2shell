import type { Localized } from '../../i18n/messages.ts';
import type { severityProfiles } from './severity.ts';

export type Scenario = {
  id: string;
  triggers: readonly [Localized, ...Localized[]];
  cause: Localized;
  score: keyof typeof severityProfiles;
};

type Pair = readonly [english: string, japanese: string];
const localize = ([en, ja]: Pair): Localized => ({ en, ja });

/** Define one fictional cause and the trigger phrases that belong to it.
 * @example scenario('dial', 'physical', ['The dial chose a shell.', 'ダイヤルがシェルを選びました。'], ['the dial stops turning', 'ダイヤルが止まったとき'])
 */
export const scenario = (
  id: string,
  score: Scenario['score'],
  cause: Pair,
  firstTrigger: Pair,
  ...otherTriggers: Pair[]
): Scenario => ({
  id,
  score,
  cause: localize(cause),
  triggers: [localize(firstTrigger), ...otherTriggers.map(localize)],
});
