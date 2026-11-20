// The first five sets are drawn by digest for older themes; their order and count are part of that mapping.
const digestIconSets = ['material', 'lucide', 'phosphor', 'bootstrap', 'tabler'] as const;
export const iconSets = [...digestIconSets, 'pixel', 'iconoir', 'remix', 'hackernoon'] as const;
export type IconSet = typeof iconSets[number];

export const fonts = {
  bitter: '"Bitter Variable", "Shippori Mincho", "Yu Mincho", serif',
  newsreader: '"Newsreader Variable", "Shippori Mincho", "Yu Mincho", serif',
  serif: '"Source Serif 4 Variable", "Shippori Mincho", "Yu Mincho", serif',
  space: '"Space Grotesk Variable", "Zen Kaku Gothic New", "Yu Gothic UI", sans-serif',
  jakarta: '"Plus Jakarta Sans Variable", "Zen Kaku Gothic New", "Yu Gothic UI", sans-serif',
  manrope: '"Manrope Variable", "Zen Kaku Gothic New", "Yu Gothic UI", sans-serif',
  work: '"Work Sans Variable", "Zen Kaku Gothic New", "Yu Gothic UI", sans-serif',
  jetbrains: '"JetBrains Mono Variable", "M PLUS 1 Code Variable", "Yu Gothic UI", monospace',
  unbounded: '"Unbounded Variable", "DotGothic16", "Yu Gothic UI", sans-serif',
  azeret: '"Azeret Mono Variable", "M PLUS 1 Code Variable", "Yu Gothic UI", monospace',
  bricolage: '"Bricolage Grotesque Variable", "RocknRoll One", "Yu Gothic UI", sans-serif',
  fraunces: '"Fraunces Variable", "Shippori Mincho", "Yu Mincho", serif',
  syne: '"Syne Variable", "RocknRoll One", "Yu Gothic UI", sans-serif',
  bungee: '"Bungee", "DotGothic16", "Yu Gothic UI", sans-serif',
  shoulders: '"Big Shoulders Display Variable", "Dela Gothic One", "Yu Gothic UI", sans-serif',
  dela: '"Dela Gothic One", "Yu Gothic UI", sans-serif',
  major: '"Major Mono Display", "M PLUS 1 Code Variable", monospace',
  xanh: '"Xanh Mono", "M PLUS 1 Code Variable", monospace',
  elite: '"Special Elite", "Klee One", "Yu Mincho", serif',
  courier: '"Courier Prime", "M PLUS 1 Code Variable", monospace',
  cinzel: '"Cinzel Decorative", "Yuji Syuku", "Yu Mincho", serif',
  fell: '"IM Fell English", "Yuji Syuku", "Yu Mincho", serif',
  latin: '"Latin Modern", "Kaisei Decol", "Yu Mincho", serif',
  kaisei: '"Kaisei Decol", "Yu Mincho", serif',
  vt323: '"VT323", "DotGothic16", monospace',
  silkscreen: '"Silkscreen", "DotGothic16", monospace',
  klee: '"Klee One", "Yu Gothic UI", cursive',
  hachi: '"Hachi Maru Pop", "Yu Gothic UI", cursive',
  oswald: '"Oswald", "Dela Gothic One", "Yu Gothic UI", sans-serif',
} as const;

const faces = {
  editorial: ['bitter', 'newsreader', 'serif'],
  window: ['space', 'jakarta', 'work'],
  dashboard: ['manrope', 'space', 'work'],
  log: ['jetbrains', 'space'],
} as const;

const bodyFaces = ['work', 'jakarta', 'manrope'] as const;

type Font = keyof typeof fonts;
type ThemeVisuals = { display: readonly Font[]; body: Font; icons?: readonly IconSet[] };
const themeVisuals: Partial<Record<DesignId, ThemeVisuals>> = {
  scanner: { display: ['unbounded', 'azeret'], body: 'azeret' },
  spectrum: { display: ['bricolage', 'unbounded'], body: 'bricolage' },
  filmstrip: { display: ['syne', 'fraunces'], body: 'bricolage' },
  'relationship-map': { display: ['bungee', 'bricolage'], body: 'work' },
  walkthrough: { display: ['fraunces', 'syne'], body: 'bricolage' },
  broadcast: { display: ['shoulders', 'dela'], body: 'work', icons: ['remix'] },
  blueprint: { display: ['major', 'xanh'], body: 'xanh', icons: ['iconoir'] },
  fax: { display: ['elite', 'courier'], body: 'courier', icons: ['bootstrap', 'iconoir'] },
  bestiary: { display: ['cinzel', 'fell'], body: 'fell', icons: ['phosphor'] },
  preprint: { display: ['latin', 'kaisei'], body: 'latin', icons: ['iconoir'] },
  bios: { display: ['vt323', 'silkscreen'], body: 'vt323', icons: ['pixel'] },
  wizard: { display: ['silkscreen', 'space'], body: 'jakarta', icons: ['hackernoon'] },
  'process-table': { display: ['jetbrains', 'azeret'], body: 'jetbrains', icons: ['pixel', 'tabler'] },
  whiteboard: { display: ['klee', 'hachi'], body: 'klee', icons: ['iconoir', 'lucide'] },
  observatory: { display: ['xanh', 'oswald'], body: 'manrope', icons: ['remix', 'tabler'] },
  kanban: { display: ['dela', 'oswald'], body: 'space', icons: ['hackernoon', 'pixel'] },
  ceremony: { display: ['hachi', 'cinzel'], body: 'bricolage', icons: ['remix', 'phosphor'] },
};

/** Pick a type pairing and icon set using separate parts of a stable digest.
 * @example advisoryVisuals('scanner', new DataView(new ArrayBuffer(4)))
 */
export const advisoryVisuals = (design: DesignId, digest: DataView) => {
  const card = designs[design].card;
  const style = themeVisuals[design];
  const options = style?.display ?? (card in faces ? faces[card as keyof typeof faces] : faces.window);
  const icons = style?.icons ?? digestIconSets;
  return {
    displayFont: options[digest.getUint8(0) % options.length],
    bodyFont: style?.body ?? (card === 'log' ? 'jetbrains' : bodyFaces[digest.getUint8(1) % bodyFaces.length]),
    iconSet: icons[digest.getUint8(2) % icons.length],
  };
};
import { designs, type DesignId } from './designs.ts';
