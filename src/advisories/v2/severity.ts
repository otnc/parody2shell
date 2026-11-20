import { severityProfiles as legacyProfiles } from '../v1/severity.ts';

export const severityProfiles = {
  ...legacyProfiles,
  'physical-disruption': {
    score: 5.2,
    rating: 'medium',
    vector: 'CVSS:4.0/AV:P/AC:L/AT:N/PR:N/UI:N/VC:N/VI:H/VA:H/SC:N/SI:N/SA:N',
  },
  'local-disruption': {
    score: 7,
    rating: 'high',
    vector: 'CVSS:4.0/AV:L/AC:L/AT:N/PR:N/UI:N/VC:N/VI:L/VA:H/SC:N/SI:N/SA:N',
  },
} as const;
