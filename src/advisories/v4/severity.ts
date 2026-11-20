import { severityProfiles as previousProfiles } from '../v2/severity.ts';

export const severityProfiles = {
  ...previousProfiles,
  remote: {
    score: 6.9,
    rating: 'medium',
    vector: 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:L/VA:N/SC:N/SI:N/SA:N',
  },
} as const;
