import type { Advisory } from '../../../advisories/generate.ts';
import { messages, type Locale } from '../../../i18n/messages.ts';

const clause = (trigger: string, locale: Locale) =>
  locale === 'ja' ? trigger : 'When ' + trigger;

/** Derive every case-file view from one record so prose, tables and diagrams agree.
 * @example caseView(advisory, 'en').versions[1].trigger
 */
export const caseView = (advisory: Advisory, locale: Locale) => {
  const s = messages[locale];
  const { evidence, investigation } = advisory;
  const hits = evidence.counts[1];
  const versions = (['baseline', 'affected', 'fixed'] as const).map(role => ({
    role,
    label: s.releaseRoles[role],
    version: role === 'baseline' ? evidence.baselineVersion : role === 'affected' ? evidence.affectedVersion : evidence.fixedVersion,
    standard: 0,
    trigger: role === 'affected' ? hits : 0,
  }));
  const sections = investigation ? [
    { id: 'expected', title: s.expected, text: investigation.expected[locale] },
    { id: 'observed', title: s.observed, text: investigation.observed[locale] },
    ...(investigation.conditions ? [{ id: 'conditions', title: s.conditions, text: investigation.conditions[locale] }] : []),
    { id: 'comparison', title: s.comparison, text: investigation.comparison[locale] },
  ] : [];
  const trace = investigation ? [
    { id: 'input', title: s.traceSteps.input, text: clause(advisory.trigger[locale], locale), state: 'neutral' },
    { id: 'expected', title: s.traceSteps.expected, text: investigation.expected[locale], state: 'expected' },
    { id: 'observed', title: s.traceSteps.observed, text: investigation.observed[locale], state: 'fault' },
    { id: 'fixed', title: s.traceSteps.fixed, text: investigation.comparison[locale], state: 'fixed' },
  ] as const : [];
  const timeline = (['observed', 'isolated', 'compared', 'published'] as const).map(key => ({
    key,
    date: evidence.timeline[key],
    title: s.timelineEvents[key],
    note: key === 'observed' ? clause(advisory.trigger[locale], locale)
      : key === 'isolated' ? (investigation?.conditions ?? advisory.affected)[locale]
      : key === 'compared' ? (investigation?.comparison ?? advisory.workaround)[locale]
      : advisory.cve,
  }));
  const component = investigation?.component[locale] ?? '';
  const flow = {
    fault: [
      { role: 'trigger', title: s.flowNodes.trigger, text: clause(advisory.trigger[locale], locale) },
      { role: 'component', title: component, text: evidence.affectedVersion },
      { role: 'shell', title: s.flowNodes.shell, text: hits + ' / ' + evidence.trials },
    ],
    fixed: [
      { role: 'trigger', title: s.flowNodes.trigger, text: clause(advisory.trigger[locale], locale) },
      { role: 'component', title: component, text: evidence.fixedVersion },
      { role: 'fixed', title: s.flowNodes.fixed, text: '0 / ' + evidence.trials },
    ],
  };
  return { sections, versions, trace, timeline, flow, note: investigation?.note[locale], hits, trials: evidence.trials };
};

export type CaseView = ReturnType<typeof caseView>;
