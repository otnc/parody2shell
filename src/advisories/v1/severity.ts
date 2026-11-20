export const severityProfiles = {
  physical: {
    score: 2.4,
    rating: 'low',
    vector: 'CVSS:4.0/AV:P/AC:L/AT:N/PR:N/UI:N/VC:N/VI:L/VA:L/SC:N/SI:N/SA:N',
  },
  local: {
    score: 5.1,
    rating: 'medium',
    vector: 'CVSS:4.0/AV:L/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:L/SC:N/SI:N/SA:N',
  },
} as const;
