// Inhalte der Seite an einer Stelle: Texte, Ablauf, Prüfprotokoll, Integrationen.
// Logos: Liegt unter public/logos/<id>.svg (oder .png) ein freigegebenes Logo, trägt man es bei `logo` ein,
// z. B. logo: '/logos/orca.svg'. Ohne Logo zeigt die Kachel ein neutrales Symbol der Kategorie.

export const KONTAKT_EMAIL = 'hallo@plua.ai'; // vor dem Livegang prüfen

export type Glyph = 'ava' | 'bim' | 'cad' | 'format' | 'norm' | 'vergabe' | 'mail' | 'cloud' | 'platform' | 'sheet' | 'chat';

export type Integration = { id: string; name: string; note: string; glyph: Glyph; logo?: string };
export type Kategorie = { id: string; titel: string; text: string; tint: string; items: Integration[] };

export const KATEGORIEN: Kategorie[] = [
  {
    id: 'ava', titel: 'AVA-Software', tint: 'orange',
    text: 'Alte LVs mit Texten, Gliederung und Preisen übernehmen, fertige LVs zurückgeben.',
    items: [
      { id: 'orca', name: 'ORCA AVA', note: 'LVs und Preise importieren', glyph: 'ava' },
      { id: 'california', name: 'California.pro', note: 'LVs, Gliederung, Preise', glyph: 'ava' },
      { id: 'itwo', name: 'RIB iTWO', note: 'Austausch über GAEB', glyph: 'ava' },
      { id: 'nevaris', name: 'NEVARIS', note: 'Austausch über GAEB', glyph: 'ava' },
      { id: 'ava-gaeb', name: 'Jede AVA mit GAEB', note: 'X83 rein, X84 raus', glyph: 'ava' },
    ],
  },
  {
    id: 'bim', titel: 'CAD und BIM', tint: 'blue',
    text: 'Mengen aus dem Modell und aus den Plänen, jede Menge mit Herkunft.',
    items: [
      { id: 'ifc', name: 'IFC 4 · openBIM', note: '3D-Modell mit Bauteilen', glyph: 'bim' },
      { id: 'revit', name: 'Autodesk Revit', note: 'über IFC', glyph: 'bim' },
      { id: 'archicad', name: 'Archicad', note: 'über IFC', glyph: 'bim' },
      { id: 'allplan', name: 'Allplan', note: 'über IFC', glyph: 'bim' },
      { id: 'vectorworks', name: 'Vectorworks', note: 'über IFC', glyph: 'bim' },
      { id: 'dwg', name: 'AutoCAD · DWG', note: 'Pläne als DWG oder PDF', glyph: 'cad' },
    ],
  },
  {
    id: 'formate', titel: 'Formate und Normen', tint: 'green',
    text: 'Was in der Ausschreibung zählt, versteht plua ai von Haus aus.',
    items: [
      { id: 'gaeb', name: 'GAEB DA XML 3.3', note: 'X83, X84, X86', glyph: 'format' },
      { id: 'vobc', name: 'VOB/C', note: 'ATV-Prüfung je Gewerk', glyph: 'norm' },
      { id: 'voba', name: 'VOB/A', note: 'Vergaberegeln im Ablauf', glyph: 'norm' },
      { id: 'din276', name: 'DIN 276', note: 'Kostengliederung', glyph: 'norm' },
      { id: 'pdf', name: 'PDF', note: 'Pläne und Angebote lesen', glyph: 'format' },
      { id: 'excel', name: 'Excel', note: 'Mengen und Preislisten', glyph: 'sheet' },
    ],
  },
  {
    id: 'vergabe', titel: 'Vergabeplattformen', tint: 'purple',
    text: 'Bekanntmachung, Rückfragen und Angebote laufen synchron mit plua ai.',
    items: [
      { id: 'dtvp', name: 'Deutsches Vergabeportal', note: 'DTVP', glyph: 'vergabe' },
      { id: 'evergabe', name: 'evergabe.de', note: 'Veröffentlichung, Angebote', glyph: 'vergabe' },
      { id: 'vmp-nrw', name: 'Vergabemarktplatz NRW', note: 'Veröffentlichung, Angebote', glyph: 'vergabe' },
      { id: 'subreport', name: 'subreport ELViS', note: 'Veröffentlichung, Angebote', glyph: 'vergabe' },
      { id: 'xvergabe', name: 'XVergabe', note: 'Standard für den Austausch', glyph: 'format' },
    ],
  },
  {
    id: 'kommunikation', titel: 'Mail und Ablage', tint: 'teal',
    text: 'Rückfragen aus dem Postfach, Unterlagen aus der Projektablage.',
    items: [
      { id: 'outlook', name: 'Microsoft 365 · Outlook', note: 'Postfach für Rückfragen', glyph: 'mail' },
      { id: 'gmail', name: 'Google Workspace', note: 'Postfach für Rückfragen', glyph: 'mail' },
      { id: 'teams', name: 'Microsoft Teams', note: 'Hinweise ins Projektteam', glyph: 'chat' },
      { id: 'sharepoint', name: 'SharePoint', note: 'Projektablage', glyph: 'cloud' },
      { id: 'onedrive', name: 'OneDrive', note: 'Projektablage', glyph: 'cloud' },
      { id: 'dropbox', name: 'Dropbox', note: 'Projektablage', glyph: 'cloud' },
    ],
  },
  {
    id: 'projekt', titel: 'Projektplattformen', tint: 'rose',
    text: 'Planstände der Fachplaner kommen automatisch an, immer der neueste Index.',
    items: [
      { id: 'acc', name: 'Autodesk Construction Cloud', note: 'Planstände', glyph: 'platform' },
      { id: 'dalux', name: 'Dalux', note: 'Planstände, Modelle', glyph: 'platform' },
      { id: 'thinkproject', name: 'thinkproject', note: 'Planmanagement', glyph: 'platform' },
      { id: 'planradar', name: 'PlanRadar', note: 'Pläne und Mängel', glyph: 'platform' },
    ],
  },
];

export const ALLE_INTEGRATIONEN = KATEGORIEN.flatMap((k) => k.items.map((i) => ({ ...i, tint: k.tint })));

export type Schritt = { nr: string; titel: string; text: string; anim: 'erkennen' | 'lv' | 'fachplaner' | 'rueckfragen' | 'preisspiegel' };

export const SCHRITTE: Schritt[] = [
  { nr: '02', titel: 'Ihre Regeln', text: 'In Ihrem Stil, nach Ihren Regeln, geprüft gegen VOB.', anim: 'lv' },
  { nr: '03', titel: 'Fachplaner', text: 'Pläne und LVs synchron, Widersprüche fallen sofort auf.', anim: 'fachplaner' },
  { nr: '04', titel: 'Rückfragen', text: 'Die KI entwirft jede Antwort. Sie geben frei.', anim: 'rueckfragen' },
  { nr: '05', titel: 'Preisspiegel', text: 'Position für Position: Abweichung, Alternative, Lücke.', anim: 'preisspiegel' },
];

export const PRUEFPROTOKOLL: [string, string, string, 'ok' | 'fix'][] = [
  ['VOB/C', 'Abschnitt 0 vollständig, Abrechnung nach Abschnitt 5', 'geprüft', 'ok'],
  ['VOB/C 4.1', 'Keine Nebenleistungen ausgeschrieben', '1 korrigiert', 'fix'],
  ['VOB/A § 7', 'Produktneutral ausgeschrieben', '1 korrigiert', 'fix'],
  ['VOB/A § 12a', 'Auskünfte an alle Bieter gleich', 'geprüft', 'ok'],
  ['Büro-Regelwerk', '18 Regeln Ihres Büros', '1 korrigiert', 'fix'],
  ['Lücken', 'Nachtragsrisiko vor dem Versand geschlossen', '5 ergänzt', 'ok'],
];

export const DATENSCHUTZ: [string, string][] = [
  ['Server in Deutschland', 'DSGVO, AV-Vertrag inklusive.'],
  ['Kein KI-Training', 'Ihre Projektdaten trainieren keine Modelle.'],
  ['Rechte je Projekt', 'Jeder sieht nur, was er sehen darf.'],
  ['Verschlüsselt', 'Jeder Zugriff protokolliert.'],
];
