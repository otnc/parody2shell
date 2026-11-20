import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { fontsourceAssets } from './dev/fontsource-assets.mjs';
import { generateOgAssets } from './dev/og-assets.mjs';

// public/og is generated, so every dev server and build (including `cf deploy`) writes it before Vite copies public/.
const ogAssets = {
  name: 'og-assets',
  hooks: {
    'astro:config:setup': async ({ logger }) => logger.info(await generateOgAssets()),
  },
};

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [ogAssets, react()],
  session: false,
  trailingSlash: 'ignore',
  server: { host: 'localhost', port: 4321 },
  devToolbar: { enabled: false },
  vite: {
    resolve: {
      alias: {
        // cf-workers-og 3.0.1 does not pass Satori's loadAdditionalAsset through ImageResponse, so cards call its renderer directly.
        'cf-workers-og-renderer': fileURLToPath(new URL('./node_modules/cf-workers-og/dist/satori.workerd-CvrKfvIT.js', import.meta.url)),
      },
    },
    plugins: [fontsourceAssets, tailwindcss()],
    css: {
      lightningcss: { drafts: { customMedia: true } },
      postcss: {
        plugins: [{
          postcssPlugin: 'advisory-library-compatibility',
          Rule(rule) {
            if (!/[\\/]xp\.css[\\/]/.test(rule.source?.input.file ?? '')) return;
            // XP.css writes `progress:not([value]):before:not([value])`, which the minifier rejects.
            // The trailing pseudo-class repeats the one before the pseudo-element, so dropping it keeps the meaning.
            const selector = rule.selector.replace(/(:{1,2}(?:before|after)):not\(\[value\]\)/g, '$1');
            // Assigning an unchanged selector would make PostCSS visit the rule again forever.
            if (selector !== rule.selector) rule.selector = selector;
          },
          AtRule: {
            media(rule) {
              // 98.css uses a nonstandard hover query that the production CSS parser rejects.
              if (rule.params === '(not(hover))') rule.params = '(hover: none)';
            },
            import(rule) {
              // PaperCSS and Bootswatch otherwise request remote font stylesheets even with local fonts selected.
              if (rule.params.includes('fonts.googleapis.com/css')) rule.remove();
            },
            property(rule) {
              if (!/[\\/]charts\.css[\\/]/.test(rule.source?.input.file ?? '')) return;
              // Unregistered variables still work when a Charts.css registration has invalid syntax.
              const syntax = rule.nodes.find(node => node.prop === 'syntax')?.value;
              const hasInitialValue = rule.nodes.some(node => node.prop === 'initial-value');
              if (!hasInitialValue || ['"<ratio>"', '"<content-position>"', '"<line-style>"'].includes(syntax)) rule.remove();
            },
          },
        }],
      },
    },
    optimizeDeps: {
      exclude: ['cf-workers-og/workerd', 'cf-workers-og-renderer'],
    },
  },
});
