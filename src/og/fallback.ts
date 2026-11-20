import { env } from 'cloudflare:workers';

type Subset = { file: string; ranges: [number, number][] };
type FamilyIndex = { family: string; subsets: Subset[] }[];
type FontOptions = { name: string; data: ArrayBuffer; weight: 400; style: 'normal' };

// Isolate-level caches: the index and each font file are fetched from static assets at most once per isolate.
let indexData: Promise<FamilyIndex> | undefined;
const files = new Map<string, Promise<ArrayBuffer | null>>();
const emoji = new Map<string, Promise<string>>();

const asset = async (origin: string, path: string) => {
  const response = await env.ASSETS.fetch(new Request(new URL(path, origin)));
  return response.ok ? response.arrayBuffer() : null;
};

const loadIndex = (origin: string) => {
  indexData ??= asset(origin, '/og/fonts.json').then(data => data ? JSON.parse(new TextDecoder().decode(data)) as FamilyIndex : []);
  return indexData;
};

const loadFile = (origin: string, file: string) => {
  let data = files.get(file);
  if (!data) {
    data = asset(origin, '/og/fonts/' + file);
    files.set(file, data);
  }
  return data;
};

// Fontsource ranges are coarse: a CJK subset can list Thai, Hangul or symbol blocks without drawing them.
// Each character therefore goes to the family made for its script, and only unscripted symbols use the general order.
const scriptFamilies: [RegExp, string][] = [
  [/\p{Script=Hangul}/u, 'Noto Sans KR'],
  [/\p{Script=Thai}/u, 'Noto Sans Thai'],
  [/\p{Script=Arabic}/u, 'IBM Plex Sans Arabic'],
  [/\p{Script=Hebrew}/u, 'Noto Sans Hebrew'],
  [/\p{Script=Devanagari}/u, 'Noto Sans Devanagari'],
  [/\p{Script=Bengali}/u, 'Noto Sans Bengali'],
  [/\p{Script=Tamil}/u, 'Noto Sans Tamil'],
  [/\p{Script=Telugu}/u, 'Noto Sans Telugu'],
  [/\p{Script=Kannada}/u, 'Noto Sans Kannada'],
  [/\p{Script=Malayalam}/u, 'Noto Sans Malayalam'],
  [/\p{Script=Gujarati}/u, 'Noto Sans Gujarati'],
  [/\p{Script=Gurmukhi}/u, 'Noto Sans Gurmukhi'],
  [/\p{Script=Sinhala}/u, 'Noto Sans Sinhala'],
  [/\p{Script=Khmer}/u, 'Noto Sans Khmer'],
  [/\p{Script=Lao}/u, 'Noto Sans Lao'],
  [/\p{Script=Myanmar}/u, 'Noto Sans Myanmar'],
  [/\p{Script=Georgian}/u, 'Noto Sans Georgian'],
  [/\p{Script=Armenian}/u, 'Noto Sans Armenian'],
  [/\p{Script=Ethiopic}/u, 'Noto Sans Ethiopic'],
  [/[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}]/u, 'Noto Sans'],
];
const generalOrder = ['Noto Sans', 'Noto Sans Symbols 2', 'Noto Sans Symbols', 'Noto Sans Math', 'Noto Emoji'];

const familiesFor = (character: string, languageCode: string) => {
  const script = scriptFamilies.find(([pattern]) => pattern.test(character))?.[1];
  if (script) return [script];
  if (/\p{Script=Han}/u.test(character)) return languageCode === 'zh-TW' || languageCode === 'zh-HK' ? ['Noto Sans TC', 'Noto Sans SC'] : ['Noto Sans SC', 'Noto Sans TC'];
  return generalOrder;
};

const covers =(ranges: [number, number][], point: number) => ranges.some(([start, end]) => point >= start && point <= end);

const toBase64 = (data: ArrayBuffer) => {
  const bytes = new Uint8Array(data);
  let text = '';
  for (let index = 0; index < bytes.length; index += 0x8000) text += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(text);
};

/** Twemoji files drop U+FE0F except inside some ZWJ sequences, so try both spellings. */
const loadEmoji = (origin: string, segment: string) => {
  const points = [...segment].map(character => character.codePointAt(0)!.toString(16));
  const names = [...new Set([points.join('-'), points.filter(point => point !== 'fe0f').join('-')])];
  const key = names[0];
  let data = emoji.get(key);
  if (!data) {
    data = (async () => {
      for (const name of names) {
        const svg = await asset(origin, '/og/emoji/' + name + '.svg');
        if (svg) return 'data:image/svg+xml;base64,' + toBase64(svg);
      }
      return '';
    })();
    emoji.set(key, data);
  }
  return data;
};

/** Report whether the generated fallback assets are deployed, so a card drawn without them is not cached.
 * @example await fallbackAvailable('https://2shell.cc')
 */
export const fallbackAvailable = async (origin: string) => {
  const index = await loadIndex(origin);
  if (index.length === 0) indexData = undefined;
  return index.length > 0;
};

/** Build Satori's loadAdditionalAsset for characters the main card font lacks.
 * @example await missingGlyphs('https://2shell.cc')('ko-KR', '한국어')
 */
export const missingGlyphs = (origin: string) => async (languageCode: string, segment: string): Promise<string | FontOptions[]> => {
  if (languageCode === 'emoji') {
    const image = await loadEmoji(origin, segment);
    // Satori also tags symbols such as ♞ as emoji; without Twemoji artwork they fall through to the symbol fonts.
    if (image) return image;
  }
  const index = await loadIndex(origin);
  const needed = new Map<string, string>();
  for (const character of new Set(segment)) {
    const point = character.codePointAt(0)!;
    for (const family of familiesFor(character, languageCode)) {
      const subsets = index.find(entry => entry.family === family)?.subsets ?? [];
      const subset = subsets.find(({ ranges }) => covers(ranges, point));
      if (subset) {
        needed.set(subset.file, family);
        break;
      }
    }
  }
  const fonts = await Promise.all([...needed].map(async ([file, name]) => {
    const data = await loadFile(origin, file);
    // Satori keeps one font per name and weight, so each subset of a family needs its own name.
    return data && { name: name + ' ' + file, data, weight: 400 as const, style: 'normal' as const };
  }));
  return fonts.filter(font => font !== null);
};
