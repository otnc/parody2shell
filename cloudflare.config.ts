import { bindings, defineConfig, triggers } from 'cf/config';

export default defineConfig({
  worker: {
    name: 'parody2shell',
    entrypoint: './src/worker.ts',
    compatibilityDate: '2026-11-17',
    compatibilityFlags: ['nodejs_compat'],
    workersDev: false,
    previewUrls: false,
    domains: ['2shell.cc'],
    triggers: [triggers.fetch({ pattern: '*.2shell.cc/*', zone: '2shell.cc' })],
    assets: { notFoundHandling: 'none', runWorkerFirst: true },
    env: { ASSETS: bindings.assets() },
    observability: { enabled: true, traces: { enabled: true } },
  },
});
