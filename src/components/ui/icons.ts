import type { IconSet } from '../../advisories/visuals.ts';
import materialHome from '@material-symbols/svg-400/outlined/home.svg?raw';
import materialLanguage from '@material-symbols/svg-400/outlined/translate.svg?raw';
import materialCopy from '@material-symbols/svg-400/outlined/content_copy.svg?raw';
import materialShare from '@material-symbols/svg-400/outlined/share.svg?raw';
import lucideHome from 'lucide-static/icons/house.svg?raw';
import lucideLanguage from 'lucide-static/icons/languages.svg?raw';
import lucideCopy from 'lucide-static/icons/copy.svg?raw';
import lucideShare from 'lucide-static/icons/share-2.svg?raw';
import phosphorHome from '@phosphor-icons/core/assets/regular/house.svg?raw';
import phosphorLanguage from '@phosphor-icons/core/assets/regular/translate.svg?raw';
import phosphorCopy from '@phosphor-icons/core/assets/regular/copy.svg?raw';
import phosphorShare from '@phosphor-icons/core/assets/regular/share-network.svg?raw';
import bootstrapHome from 'bootstrap-icons/icons/house.svg?raw';
import bootstrapLanguage from 'bootstrap-icons/icons/translate.svg?raw';
import bootstrapCopy from 'bootstrap-icons/icons/copy.svg?raw';
import bootstrapShare from 'bootstrap-icons/icons/share.svg?raw';
import tablerHome from '@tabler/icons/outline/home.svg?raw';
import tablerLanguage from '@tabler/icons/outline/language.svg?raw';
import tablerCopy from '@tabler/icons/outline/copy.svg?raw';
import tablerShare from '@tabler/icons/outline/share.svg?raw';

import pixelHome from 'pixelarticons/svg/home.svg?raw';
import pixelLanguage from 'pixelarticons/svg/languages.svg?raw';
import pixelCopy from 'pixelarticons/svg/copy.svg?raw';
import pixelShare from 'pixelarticons/svg/share.svg?raw';
import iconoirHome from 'iconoir/icons/regular/home.svg?raw';
import iconoirLanguage from 'iconoir/icons/regular/translate.svg?raw';
import iconoirCopy from 'iconoir/icons/regular/copy.svg?raw';
import iconoirShare from 'iconoir/icons/regular/share-android.svg?raw';
import remixHome from 'remixicon/icons/Buildings/home-line.svg?raw';
import remixLanguage from 'remixicon/icons/Editor/translate.svg?raw';
import remixCopy from 'remixicon/icons/Document/file-copy-line.svg?raw';
import remixShare from 'remixicon/icons/System/share-line.svg?raw';
import hackernoonHome from '@hackernoon/pixel-icon-library/icons/SVG/regular/home.svg?raw';
import hackernoonLanguage from '@hackernoon/pixel-icon-library/icons/SVG/regular/translate.svg?raw';
import hackernoonCopy from '@hackernoon/pixel-icon-library/icons/SVG/regular/copy.svg?raw';
import hackernoonShare from '@hackernoon/pixel-icon-library/icons/SVG/regular/share.svg?raw';

export type IconName = 'home' | 'language' | 'copy' | 'share';

export const iconArtwork = {
  material: { home: materialHome, language: materialLanguage, copy: materialCopy, share: materialShare },
  lucide: { home: lucideHome, language: lucideLanguage, copy: lucideCopy, share: lucideShare },
  phosphor: { home: phosphorHome, language: phosphorLanguage, copy: phosphorCopy, share: phosphorShare },
  bootstrap: { home: bootstrapHome, language: bootstrapLanguage, copy: bootstrapCopy, share: bootstrapShare },
  tabler: { home: tablerHome, language: tablerLanguage, copy: tablerCopy, share: tablerShare },
  pixel: { home: pixelHome, language: pixelLanguage, copy: pixelCopy, share: pixelShare },
  iconoir: { home: iconoirHome, language: iconoirLanguage, copy: iconoirCopy, share: iconoirShare },
  remix: { home: remixHome, language: remixLanguage, copy: remixCopy, share: remixShare },
  hackernoon: { home: hackernoonHome, language: hackernoonLanguage, copy: hackernoonCopy, share: hackernoonShare },
} satisfies Record<IconSet, Record<IconName, string>>;
