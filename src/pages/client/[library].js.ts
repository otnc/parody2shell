import type { APIRoute, GetStaticPaths } from 'astro';

const browserLibraries = {
  splide: () => import('@splidejs/splide?raw'),
  panzoom: () => import('@panzoom/panzoom/dist/panzoom.es.js?raw'),
  driver: () => import('driver.js?raw'),
  'rough-notation': () => import('rough-notation/lib/rough-notation.esm.js?raw'),
  roughjs: () => import('roughjs/bundled/rough.esm.js?raw'),
  chartist: () => import('chartist/dist/index.js?raw'),
  'page-flip': () => import('page-flip/dist/js/page-flip.browser.js?raw'),
  fireworks: () => import('fireworks-js?raw'),
};

export const prerender = true;
export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(browserLibraries).map(library => ({ params: { library } }));

export const GET: APIRoute = async ({ params }) => {
  const library = params.library;
  if (!library || !Object.hasOwn(browserLibraries, library)) {
    return new Response(null, { status: 404 });
  }
  const { default: source } = await browserLibraries[library as keyof typeof browserLibraries]();
  return new Response(source, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
};
