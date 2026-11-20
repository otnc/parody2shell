import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const packages = Object.keys(require('../package.json').dependencies).filter(name => name.startsWith('@fontsource'));
const fontDirectories = new Map(packages.map(name => [name, join(dirname(require.resolve(name + '/package.json')), 'files')]));
const fontPath = /^\/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@fontsource(?:-variable)?\/[a-z0-9-]+)\/files\/([a-z0-9-]+\.(woff2?))$/;

/** Serve Fontsource assets before the Worker handles development routes. */
export const fontsourceAssets = {
  name: 'local-fontsource-assets',
  enforce: 'pre',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const match = fontPath.exec(request.url?.split('?')[0] ?? '');
      if (!match || (request.method !== 'GET' && request.method !== 'HEAD')) return next();
      const [, packageName, filename, format] = match;
      const directory = fontDirectories.get(packageName);
      if (!directory) return next();
      let bytes;
      try {
        bytes = await readFile(join(directory, filename));
      } catch {
        return next();
      }
      response.setHeader('Content-Type', 'font/' + format);
      response.setHeader('Content-Length', bytes.length);
      response.end(request.method === 'HEAD' ? undefined : bytes);
    });
  },
};
