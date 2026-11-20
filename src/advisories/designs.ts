import type { Localized } from '../i18n/messages.ts';
import { designIds as legacyDesignIds } from './v1/designs.ts';

// The order is part of the expanded catalog's deterministic mapping.
export const secondEditionDesignIds = [
  ...legacyDesignIds,
  'newswire', 'issue', 'manual', 'terminal', 'property-sheet', 'wire',
  'notebook', 'register', 'monitor', 'arcade', 'helpdesk', 'briefing',
] as const;

export const thirdEditionDesignIds = [
  ...secondEditionDesignIds,
  'departures', 'dossier', 'exhibit', 'claim', 'exchange', 'knowledge', 'postcard', 'classifieds',
] as const;

export const interactiveDesignIds = ['scanner', 'spectrum', 'filmstrip', 'relationship-map', 'walkthrough'] as const;
// The fourth edition is chosen from its own bucket, so this order is part of its mapping.
export const fourthEditionDesignIds = [
  'broadcast', 'blueprint', 'fax', 'bestiary', 'preprint', 'bios',
  'wizard', 'process-table', 'whiteboard', 'observatory', 'kanban', 'ceremony',
] as const;
export const designIds = [...thirdEditionDesignIds, ...interactiveDesignIds, ...fourthEditionDesignIds] as const;

export type DesignId = typeof designIds[number];
export type ThirdEditionDesignId = typeof thirdEditionDesignIds[number] | typeof interactiveDesignIds[number];
export type FourthEditionDesignId = typeof fourthEditionDesignIds[number];
export type ExpandedDesignId = Exclude<DesignId, typeof legacyDesignIds[number]>;
export type CardStyle = 'editorial' | 'window' | 'dashboard' | 'log' | 'signal' | 'blueprint' | 'paper' | 'folio' | 'pixel' | 'board';

type Design = {
  publication: Localized;
  example: string;
  background: string;
  ink: string;
  accent: string;
  panel: string;
  card: CardStyle;
};

export const designs = {
  recall: { publication: { en: 'Security Advisory', ja: 'セキュリティアドバイザリ' }, example: 'paperclip', background: '#fff7e7', ink: '#2a211b', accent: '#912e21', panel: '#eccdb8', card: 'editorial' },
  research: { publication: { en: 'Technical Details', ja: '技術的詳細' }, example: '日本語', background: '#f5f9fd', ink: '#183659', accent: '#285992', panel: '#e0ecf8', card: 'editorial' },
  incident: { publication: { en: 'Impact Summary', ja: '影響の概要' }, example: 'umbrella', background: '#14294d', ink: '#f1f7ff', accent: '#9fdfff', panel: '#244471', card: 'dashboard' },
  maintainer: { publication: { en: 'Security Update', ja: 'セキュリティ更新情報' }, example: 'toaster', background: '#f1eaf8', ink: '#332444', accent: '#67449a', panel: '#e5d7f2', card: 'window' },
  newswire: { publication: { en: 'Vulnerability Disclosure', ja: '脆弱性の公開情報' }, example: 'kettle', background: '#fbf5e9', ink: '#241d19', accent: '#97231d', panel: '#ecded0', card: 'editorial' },
  issue: { publication: { en: 'Vulnerability Assessment', ja: '脆弱性評価' }, example: 'rubber-duck', background: '#f4f8fc', ink: '#162330', accent: '#23614d', panel: '#deeee7', card: 'window' },
  manual: { publication: { en: 'Mitigations', ja: '緩和策' }, example: 'compass', background: '#f5f7ec', ink: '#202c20', accent: '#486d30', panel: '#dce8d0', card: 'editorial' },
  terminal: { publication: { en: 'Technical Analysis', ja: '技術分析' }, example: 'calculator', background: '#132624', ink: '#e1f7d6', accent: '#81e188', panel: '#25453b', card: 'log' },
  'property-sheet': { publication: { en: 'Affected Configurations', ja: '影響を受ける構成' }, example: 'floppy-disk', background: '#dcd9d5', ink: '#171224', accent: '#3a287a', panel: '#eae7f6', card: 'window' },
  wire: { publication: { en: 'Advisory Summary', ja: 'アドバイザリ概要' }, example: 'radish', background: '#fff6f1', ink: '#562a23', accent: '#a7352a', panel: '#f6d8cd', card: 'dashboard' },
  notebook: { publication: { en: 'Validation Results', ja: '検証結果' }, example: 'pineapple', background: '#fff8df', ink: '#37301c', accent: '#815326', panel: '#f1e5b9', card: 'editorial' },
  register: { publication: { en: 'CVE Record', ja: 'CVE レコード' }, example: 'stapler', background: '#f7f2ff', ink: '#302245', accent: '#65348a', panel: '#eadcf9', card: 'log' },
  monitor: { publication: { en: 'Vulnerability Status', ja: '脆弱性の対応状況' }, example: 'clockwork', background: '#edf7fb', ink: '#183349', accent: '#096b88', panel: '#d6edf4', card: 'dashboard' },
  arcade: { publication: { en: 'Regression Test Results', ja: '回帰テスト結果' }, example: 'joystick', background: '#392b4b', ink: '#fff7e1', accent: '#ffd67b', panel: '#544067', card: 'window' },
  helpdesk: { publication: { en: 'Remediation Guidance', ja: '修正手順' }, example: 'bookshelf', background: '#f3f6ff', ink: '#222d55', accent: '#3d4d89', panel: '#e4eaff', card: 'editorial' },
  briefing: { publication: { en: 'Severity Assessment', ja: '深刻度評価' }, example: 'tangerine', background: '#fff3e2', ink: '#412925', accent: '#914623', panel: '#f9dec6', card: 'dashboard' },
  departures: { publication: { en: 'Remediation Status', ja: '修正状況' }, example: 'turnstile', background: '#0c2226', ink: '#f6ffe9', accent: '#dfef59', panel: '#1a3537', card: 'log' },
  dossier: { publication: { en: 'Disclosure Record', ja: '脆弱性の公開記録' }, example: 'microfilm', background: '#f0e7d5', ink: '#342e25', accent: '#834229', panel: '#e4d4bb', card: 'editorial' },
  exhibit: { publication: { en: 'Vulnerability Analysis', ja: '脆弱性分析' }, example: 'paintbrush', background: '#f6f3eb', ink: '#211d35', accent: '#5222c1', panel: '#e7e1f6', card: 'editorial' },
  claim: { publication: { en: 'Affected Products', ja: '影響を受ける製品' }, example: 'windshield', background: '#e8eef8', ink: '#162b50', accent: '#174eac', panel: '#e5edff', card: 'window' },
  exchange: { publication: { en: 'Affected Versions', ja: '影響を受けるバージョン' }, example: 'goldfish', background: '#eaf6f1', ink: '#103629', accent: '#006343', panel: '#d2ede0', card: 'dashboard' },
  knowledge: { publication: { en: 'Workarounds', ja: '回避策' }, example: 'badge-reader', background: '#fff5e9', ink: '#34223a', accent: '#942f66', panel: '#f2e4ed', card: 'window' },
  postcard: { publication: { en: 'Update Notice', ja: '更新のお知らせ' }, example: 'postbox', background: '#f8ede1', ink: '#412d32', accent: '#9b3545', panel: '#f1d6c8', card: 'editorial' },
  classifieds: { publication: { en: 'Vulnerability Summary', ja: '脆弱性の概要' }, example: 'teacup', background: '#f7efd4', ink: '#392b23', accent: '#a03421', panel: '#f0dfaf', card: 'window' },
  scanner: { publication: { en: 'Detection Results', ja: '検出結果' }, example: 'meteorite', background: '#061421', ink: '#e4f8ff', accent: '#69e4fe', panel: '#101f38', card: 'log' },
  spectrum: { publication: { en: 'Reproduction Test Results', ja: '再現試験結果' }, example: 'tuning-fork', background: '#f8efe6', ink: '#241538', accent: '#a72145', panel: '#efcfda', card: 'dashboard' },
  filmstrip: { publication: { en: 'Analysis Notes', ja: '分析記録' }, example: 'film-reel', background: '#221c31', ink: '#fff7e4', accent: '#f2bd78', panel: '#382841', card: 'editorial' },
  'relationship-map': { publication: { en: 'Root Cause Analysis', ja: '根本原因分析' }, example: 'magnetic-board', background: '#dfeaf1', ink: '#172854', accent: '#1746a5', panel: '#c1d6ec', card: 'dashboard' },
  walkthrough: { publication: { en: 'Technical Review', ja: '技術レビュー' }, example: 'magnifier', background: '#fcf1d7', ink: '#241b2e', accent: '#702c56', panel: '#efdbec', card: 'window' },
  broadcast: { publication: { en: 'Security Bulletin', ja: 'セキュリティ速報' }, example: 'antenna', background: '#120c2b', ink: '#f6f1ff', accent: '#ff5fb0', panel: '#271b52', card: 'signal' },
  blueprint: { publication: { en: 'Root Cause Diagram', ja: '根本原因の構成図' }, example: 'drafting-table', background: '#123d6b', ink: '#e8f3ff', accent: '#ffd25a', panel: '#1b4f86', card: 'blueprint' },
  fax: { publication: { en: 'Vendor Notification', ja: 'ベンダーへの通知' }, example: 'fax-machine', background: '#f1eee4', ink: '#1d1d1b', accent: '#3c3c38', panel: '#e1dccd', card: 'paper' },
  bestiary: { publication: { en: 'Vulnerability Catalog', ja: '脆弱性カタログ' }, example: 'field-guide', background: '#efe3c4', ink: '#2b1d10', accent: '#7b2a12', panel: '#dcc89a', card: 'folio' },
  preprint: { publication: { en: 'Technical Report', ja: '技術報告書' }, example: 'slide-rule', background: '#fffff8', ink: '#141414', accent: '#7a1f1f', panel: '#eeeee4', card: 'paper' },
  bios: { publication: { en: 'Firmware Advisory', ja: 'ファームウェアの脆弱性情報' }, example: 'motherboard', background: '#0000a8', ink: '#e8e8e8', accent: '#ffff55', panel: '#a8a8a8', card: 'pixel' },
  wizard: { publication: { en: 'Update Guidance', ja: '更新の手引き' }, example: 'screensaver', background: '#3a6ea5', ink: '#10203a', accent: '#0a246a', panel: '#ece9d8', card: 'window' },
  'process-table': { publication: { en: 'Runtime Analysis', ja: '実行時分析' }, example: 'mainframe', background: '#0b0e0c', ink: '#d6e8d0', accent: '#7cdf64', panel: '#1a221c', card: 'log' },
  whiteboard: { publication: { en: 'Post-Incident Review', ja: '事後レビュー' }, example: 'whiteboard', background: '#fbfbf7', ink: '#1f2a44', accent: '#d9342b', panel: '#e9edf2', card: 'board' },
  observatory: { publication: { en: 'Measurement Report', ja: '計測報告' }, example: 'barometer', background: '#0d1b1e', ink: '#e6f1ee', accent: '#f2a541', panel: '#16302f', card: 'dashboard' },
  kanban: { publication: { en: 'Triage Board', ja: 'トリアージ状況' }, example: 'sticky-note', background: '#fef3c7', ink: '#000000', accent: '#ff6b6b', panel: '#a5f3fc', card: 'board' },
  ceremony: { publication: { en: 'Fix Release Notice', ja: '修正版の公開' }, example: 'confetti', background: '#1a1033', ink: '#fff6e6', accent: '#ffc94a', panel: '#2d1c55', card: 'signal' },
} as const satisfies Record<DesignId, Design>;

// Keep the themes previously assigned to these public examples.
export const designExampleLabels = {
  recall: 'react',
  research: 'なでしこ',
  incident: 'python',
  maintainer: 'typescript',
  newswire: 'rust',
  issue: 'vue',
  manual: 'go',
  terminal: 'bash',
  'property-sheet': 'delphi',
  wire: 'javascript',
  notebook: 'kotlin',
  register: 'sql',
  monitor: 'fastapi',
  arcade: 'lua',
  helpdesk: 'django',
  briefing: 'angular',
  departures: 'java',
  dossier: 'cobol',
  exhibit: 'svelte',
  claim: 'laravel',
  exchange: 'elixir',
  knowledge: 'ruby-on-rails',
  postcard: 'ruby',
  classifieds: 'swift',
  scanner: 'zig',
  spectrum: 'julia',
  filmstrip: 'astro',
  'relationship-map': 'flask',
  walkthrough: 'aspnet-core',
} as const satisfies Record<ThirdEditionDesignId, string>;
