import type { Advisory } from '../../advisories/generate.ts';
import type { Locale } from '../../i18n/messages.ts';

export type AdvisoryLayoutProps = {
  advisory: Advisory;
  locale: Locale;
  canonical: URL;
  alternate: URL;
  home: URL;
  shareTitle: string;
};
