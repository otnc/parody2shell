import { scenarios as legacyScenarios } from '../v1/scenarios.ts';
import { hardwareScenarios } from './hardware.ts';
import { interfaceScenarios } from './interface.ts';
import { recordScenarios } from './records.ts';
import { serviceScenarios } from './services.ts';
import { workflowScenarios } from './workflow.ts';

// Published order determines the scenario assigned to each label.
export const scenarios = [
  ...legacyScenarios,
  ...hardwareScenarios,
  ...interfaceScenarios,
  ...workflowScenarios,
  ...serviceScenarios,
  ...recordScenarios,
] as const;
