import type { DesignId } from '../../advisories/designs.ts';
import Recall from './designs/Recall.astro';
import Research from './designs/Research.astro';
import Incident from './designs/Incident.astro';
import Maintainer from './designs/Maintainer.astro';
import Newswire from './themes/Newswire.astro';
import Issue from './themes/Issue.astro';
import Manual from './themes/Manual.astro';
import Terminal from './themes/Terminal.astro';
import PropertySheet from './themes/PropertySheet.astro';
import Wire from './themes/Wire.astro';
import Notebook from './themes/Notebook.astro';
import Register from './themes/Register.astro';
import Monitor from './themes/Monitor.astro';
import Arcade from './themes/Arcade.astro';
import Helpdesk from './themes/Helpdesk.astro';
import Briefing from './themes/Briefing.astro';
import Departures from './themes/Departures.astro';
import Dossier from './themes/Dossier.astro';
import Exhibit from './themes/Exhibit.astro';
import Claim from './themes/Claim.astro';
import Exchange from './themes/Exchange.astro';
import Knowledge from './themes/Knowledge.astro';
import Postcard from './themes/Postcard.astro';
import Classifieds from './themes/Classifieds.astro';
import Scanner from './themes/Scanner.astro';
import Spectrum from './themes/Spectrum.astro';
import Filmstrip from './themes/Filmstrip.astro';
import RelationshipMap from './themes/RelationshipMap.astro';
import Walkthrough from './themes/Walkthrough.astro';
import Broadcast from './themes/Broadcast.astro';
import Blueprint from './themes/Blueprint.astro';
import Fax from './themes/Fax.astro';
import Bestiary from './themes/Bestiary.astro';
import Preprint from './themes/Preprint.astro';
import Bios from './themes/Bios.astro';
import Wizard from './themes/Wizard.astro';
import ProcessTable from './themes/ProcessTable.astro';
import Whiteboard from './themes/Whiteboard.astro';
import Observatory from './themes/Observatory.astro';
import Kanban from './themes/Kanban.astro';
import Ceremony from './themes/Ceremony.astro';

export const layouts = {
  recall: Recall, research: Research, incident: Incident, maintainer: Maintainer,
  newswire: Newswire, issue: Issue, manual: Manual, terminal: Terminal,
  'property-sheet': PropertySheet, wire: Wire, notebook: Notebook, register: Register,
  monitor: Monitor, arcade: Arcade, helpdesk: Helpdesk, briefing: Briefing,
  departures: Departures, dossier: Dossier, exhibit: Exhibit, claim: Claim,
  exchange: Exchange, knowledge: Knowledge, postcard: Postcard, classifieds: Classifieds,
  scanner: Scanner, spectrum: Spectrum, filmstrip: Filmstrip, 'relationship-map': RelationshipMap, walkthrough: Walkthrough,
  broadcast: Broadcast, blueprint: Blueprint, fax: Fax, bestiary: Bestiary, preprint: Preprint, bios: Bios,
  wizard: Wizard, 'process-table': ProcessTable, whiteboard: Whiteboard, observatory: Observatory, kanban: Kanban, ceremony: Ceremony,
} satisfies Record<DesignId, typeof Recall>;
