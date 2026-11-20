// Copy the fallback fonts and emoji artwork that social cards load on demand into public/og.
// The Astro integration in astro.config.mjs runs this for every dev server and build, including `cf deploy`.
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public', 'og');
const licenses = join(root, 'public', 'licenses');
const require = createRequire(import.meta.url);

// Order is the fallback order: the first family whose subset covers a character supplies it.
const families = [
  ['Noto Sans', 'noto-sans'],
  ['Noto Sans SC', 'noto-sans-sc'],
  ['Noto Sans TC', 'noto-sans-tc'],
  ['Noto Sans KR', 'noto-sans-kr'],
  ['Noto Sans Thai', 'noto-sans-thai'],
  // Noto Sans Arabic uses a GSUB lookup that Satori's opentype.js rejects; IBM Plex Sans Arabic shapes correctly.
  ['IBM Plex Sans Arabic', 'ibm-plex-sans-arabic'],
  ['Noto Sans Hebrew', 'noto-sans-hebrew'],
  ['Noto Sans Devanagari', 'noto-sans-devanagari'],
  ['Noto Sans Bengali', 'noto-sans-bengali'],
  ['Noto Sans Tamil', 'noto-sans-tamil'],
  ['Noto Sans Telugu', 'noto-sans-telugu'],
  ['Noto Sans Kannada', 'noto-sans-kannada'],
  ['Noto Sans Malayalam', 'noto-sans-malayalam'],
  ['Noto Sans Gujarati', 'noto-sans-gujarati'],
  ['Noto Sans Gurmukhi', 'noto-sans-gurmukhi'],
  ['Noto Sans Sinhala', 'noto-sans-sinhala'],
  ['Noto Sans Khmer', 'noto-sans-khmer'],
  ['Noto Sans Lao', 'noto-sans-lao'],
  ['Noto Sans Myanmar', 'noto-sans-myanmar'],
  ['Noto Sans Georgian', 'noto-sans-georgian'],
  ['Noto Sans Armenian', 'noto-sans-armenian'],
  ['Noto Sans Ethiopic', 'noto-sans-ethiopic'],
  ['Noto Sans Symbols', 'noto-sans-symbols'],
  ['Noto Sans Symbols 2', 'noto-sans-symbols-2'],
  ['Noto Sans Math', 'noto-sans-math'],
  ['Noto Emoji', 'noto-emoji'],
];

const parseRanges = (value) => value.split(',').map((part) => {
  const [start, end = start] = part.trim().replace(/^U\+/i, '').split('-');
  return [parseInt(start, 16), parseInt(end, 16)];
});

const packageDir = (name) => dirname(require.resolve(name + '/package.json'));

/** Write public/og and the matching license files.
 * @example await generateOgAssets()
 */
export const generateOgAssets = async () => {
  // Skip the copy when the same package versions already produced public/og, so dev restarts do not churn files.
  const stamp = JSON.stringify([families, ...[...families.map(([, id]) => '@fontsource/' + id), '@twemoji/svg']
    .map(name => require(name + '/package.json').version)]);
  const previous = await readFile(join(output, 'stamp.json'), 'utf8').catch(() => '');
  if (previous === stamp) return 'og assets: up to date';
  await rm(output, { recursive: true, force: true });
  await mkdir(join(output, 'fonts'), { recursive: true });
  await mkdir(join(output, 'emoji'), { recursive: true });

  const index = [];
  for (const [family, id] of families) {
    const dir = packageDir('@fontsource/' + id);
    const unicode = JSON.parse(await readFile(join(dir, 'unicode.json'), 'utf8'));
    const subsets = [];
    for (const [key, value] of Object.entries(unicode)) {
      const subset = key.replace(/^\[|\]$/g, '');
      // Satori reads WOFF but not WOFF2.
      const source = join(dir, 'files', `${id}-${subset}-400-normal.woff`);
      const file = `${id}-${subset}.woff`;
      try {
        await copyFile(source, join(output, 'fonts', file));
      } catch {
        continue;
      }
      subsets.push({ file, ranges: parseRanges(value) });
    }
    index.push({ family, subsets });
    await copyFile(join(dir, 'LICENSE'), join(licenses, 'fontsource-' + id + '.txt')).catch(() => {});
  }
  await writeFile(join(output, 'fonts.json'), JSON.stringify(index));

  const emojiDir = packageDir('@twemoji/svg');
  const emoji = (await readdir(emojiDir)).filter(name => name.endsWith('.svg'));
  await Promise.all(emoji.map(name => copyFile(join(emojiDir, name), join(output, 'emoji', name))));
  await writeFile(join(licenses, 'twemoji.txt'), [
    'Twemoji graphics',
    'Copyright 2019 Twitter, Inc and other contributors',
    'Copyright 2024 jdecked and other contributors (https://github.com/jdecked/twemoji)',
    'Licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/',
    'Optimized SVG files from @twemoji/svg (https://github.com/boywithkeyboard/twemoji_svg).',
    '',
  ].join('\n'));

  await writeFile(join(output, 'stamp.json'), stamp);
  return (`og assets: ${index.reduce((sum, { subsets }) => sum + subsets.length, 0)} font subsets, ${emoji.length} emoji`);
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log(await generateOgAssets());
