import bulma from 'bulma/css/bulma.min.css?url';
import primer from '@primer/css/dist/primer.css?url';
import pico from '@picocss/pico/css/pico.min.css?url';
import terminal from 'terminal.css/dist/terminal.min.css?url';
import utility from '98.css/style.css?url';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css?url';
import paper from 'papercss/dist/paper.min.css?url';
import spectre from 'spectre.css/dist/spectre.min.css?url';
import tabler from '@tabler/core/dist/css/tabler.min.css?url';
import nes from 'nes.css/css/nes.min.css?url';
import uikit from 'uikit/dist/css/uikit.min.css?url';
import beer from 'beercss/dist/cdn/beer.min.css?url';
import pure from 'purecss/build/pure-min.css?url';
import tufte from 'tufte-css/tufte.min.css?url';
import mvp from 'mvp.css/mvp.css?url';
import milligram from 'milligram/dist/milligram.min.css?url';
import picnic from 'picnic/picnic.min.css?url';
import water from 'water.css/out/light.min.css?url';
import sakura from 'sakura.css/css/sakura.css?url';
import chota from 'chota/dist/chota.min.css?url';
import augmented from 'augmented-ui/augmented-ui.min.css?url';
import charts from 'charts.css/dist/charts.min.css?url';
import splide from '@splidejs/splide/css?url';
import openProps from 'open-props/open-props.min.css?url';
import driver from 'driver.js/dist/driver.css?url';
import vapor from 'bootswatch/dist/vapor/bootstrap.css?url';
import latex from 'latex.css/style.css?url';
import tui from 'tuicss/dist/tuicss.min.css?url';
import xp from 'xp.css/dist/XP.css?url';
import webtui from '@webtui/css/full.css?url';
import chartist from 'chartist/dist/index.min.css?url';
import neobrutalism from 'neobrutalismcss/dist/index.min.css?url';
import type { DesignId, ExpandedDesignId } from '../advisories/designs.ts';

// These themes take their idiom from a browser library alone and ship no library stylesheet.
type ScriptOnlyDesignId = 'blueprint' | 'fax' | 'bestiary' | 'whiteboard' | 'ceremony';
type StyledDesignId = Exclude<ExpandedDesignId, ScriptOnlyDesignId>;

export const librarySheets: Partial<Record<DesignId, string>> = {
  newswire: bulma, issue: primer, manual: pico, terminal, 'property-sheet': utility, wire: bootstrap,
  notebook: paper, register: spectre, monitor: tabler, arcade: nes, helpdesk: uikit, briefing: beer,
  departures: pure, dossier: tufte, exhibit: mvp, claim: milligram,
  exchange: picnic, knowledge: water, postcard: sakura, classifieds: chota,
  scanner: augmented, spectrum: charts, filmstrip: splide, 'relationship-map': openProps, walkthrough: driver,
  broadcast: vapor, preprint: latex, bios: tui, wizard: xp, 'process-table': webtui, observatory: chartist, kanban: neobrutalism,
} satisfies Record<StyledDesignId, string>;

const inlineSheets: Partial<Record<DesignId, () => Promise<{ default: string }>>> = {
  newswire: () => import('bulma/css/bulma.min.css?inline'),
  issue: () => import('@primer/css/dist/primer.css?inline'),
  manual: () => import('@picocss/pico/css/pico.min.css?inline'),
  terminal: () => import('terminal.css/dist/terminal.min.css?inline'),
  'property-sheet': () => import('98.css/style.css?inline'),
  wire: () => import('bootstrap/dist/css/bootstrap.min.css?inline'),
  notebook: () => import('papercss/dist/paper.min.css?inline'),
  register: () => import('spectre.css/dist/spectre.min.css?inline'),
  monitor: () => import('@tabler/core/dist/css/tabler.min.css?inline'),
  arcade: () => import('nes.css/css/nes.min.css?inline'),
  helpdesk: () => import('uikit/dist/css/uikit.min.css?inline'),
  briefing: () => import('beercss/dist/cdn/beer.min.css?inline'),
  departures: () => import('purecss/build/pure-min.css?inline'),
  dossier: () => import('tufte-css/tufte.min.css?inline'),
  exhibit: () => import('mvp.css/mvp.css?inline'),
  claim: () => import('milligram/dist/milligram.min.css?inline'),
  exchange: () => import('picnic/picnic.min.css?inline'),
  knowledge: () => import('water.css/out/light.min.css?inline'),
  postcard: () => import('sakura.css/css/sakura.css?inline'),
  classifieds: () => import('chota/dist/chota.min.css?inline'),
  scanner: () => import('augmented-ui/augmented-ui.min.css?inline'),
  spectrum: () => import('charts.css/dist/charts.min.css?inline'),
  filmstrip: () => import('@splidejs/splide/css?inline'),
  'relationship-map': () => import('open-props/open-props.min.css?inline'),
  walkthrough: () => import('driver.js/dist/driver.css?inline'),
  broadcast: () => import('bootswatch/dist/vapor/bootstrap.css?inline'),
  preprint: () => import('latex.css/style.css?inline'),
  bios: () => import('tuicss/dist/tuicss.min.css?inline'),
  wizard: () => import('xp.css/dist/XP.css?inline'),
  'process-table': () => import('@webtui/css/full.css?inline'),
  observatory: () => import('chartist/dist/index.min.css?inline'),
  kanban: () => import('neobrutalismcss/dist/index.min.css?inline'),
} satisfies Record<StyledDesignId, () => Promise<{ default: string }>>;

/** Load the selected stylesheet in development, where workerd does not serve npm asset paths.
 * @example await developmentLibraryCss('arcade')
 */
export const developmentLibraryCss = async (design: DesignId) => {
  if (!import.meta.env.DEV) return;
  return (await inlineSheets[design]?.())?.default;
};
