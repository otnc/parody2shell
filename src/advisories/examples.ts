const alphabeticalExamples = [
  'wordpress', 'react', 'php', 'nginx', 'rust',
  'python', 'zig', 'bash', 'node', 'vercel',
  'java', 'cobol', 'ruby', 'nextjs',
  'linux', 'windows', 'mac', 'zsh', 'javascript',
  'typescript', 'chrome', 'firefox', 'apache', 'http',
  'human', 'shell', 'agent', 'microwave', 'google',
  'coffee', 'root', 'twitter', 'line', 'microsoft',
] as const;

const japaneseExamples = ['なでしこ', '貝'] as const;

const additionalAlphabeticalSubjects = [
  'alpine', 'ansible', 'astro', 'axios',
  'banana', 'battery', 'blender', 'bluetooth', 'bun',
  'calendar', 'calculator', 'camera', 'carrot', 'chess',
  'clock', 'cloudflare', 'coconut', 'compass', 'curl',
  'database', 'deno', 'discord', 'docker', 'dotnet',
  'editor', 'electron', 'elixir', 'emacs', 'excalidraw',
  'fastapi', 'flask', 'floppy', 'git', 'github',
  'golang', 'graphql', 'haskell', 'hono', 'html',
  'jellyfish', 'julia', 'kotlin', 'kubernetes', 'laravel',
  'lemon', 'lighthouse', 'lua', 'mailbox', 'markdown',
  'matcha', 'mochi', 'mongodb', 'neovim', 'notebook',
  'notion', 'obsidian', 'octopus', 'onion', 'openssl',
  'paperclip', 'pebble', 'penguin', 'perplexity', 'piano',
  'pineapple', 'popcorn', 'postgres', 'pudding', 'quartz',
  'redis', 'remix', 'rice', 'rocket', 'scissors',
  'svelte', 'tea', 'toaster', 'umbrella', 'vite', 'web',
] as const;

// Each fourth-edition theme has one of these as its pinned example.
const fourthEditionSubjects = [
  'antenna', 'barometer', 'confetti', 'drafting-table', 'fax-machine', 'slide-rule',
  'field-guide', 'mainframe', 'motherboard', 'screensaver', 'sticky-note', 'whiteboard',
] as const;

export const homeExamples = [...alphabeticalExamples.toSorted(), ...japaneseExamples] as const;
// These names keep the assignments they had before the fourth edition.
export const legacyHeadlineSubjects = [
  ...[...alphabeticalExamples, ...additionalAlphabeticalSubjects].toSorted(),
  ...japaneseExamples,
] as const;
export const headlineSubjects = [
  ...[...alphabeticalExamples, ...additionalAlphabeticalSubjects, ...fourthEditionSubjects].toSorted(),
  ...japaneseExamples,
] as const;
export const headlineSuffix = '2shell lol';
export const homeHeadline = headlineSubjects[0] + headlineSuffix;
// The social card for the top page speaks for every subject rather than the first name in the rotation.
export const socialHeadline = 'everything2shell';
