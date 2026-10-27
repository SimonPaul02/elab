// Video 19 · Demo „LV mit KI erstellen“ (Fassung 3, max. 3 min). Bedient den klickbaren Prototyp ../prototyp/lv-ki.html,
// nicht die App. Ablauf: Unterlagen mit IFC-Modell, Fachplaner-Sync, Import aus ORCA AVA / California → Büro-Regelwerk und
// Textdatenbank → Gewerke-Paketierung → Rückfragen → Erstellen (3D-Modell, Grundriss) → schlichtes LV mit Prüfung →
// Fachplaner und Schnittstellenprüfung → Datenschutz → neue Planstände → Versand inkl. Vergabeplattform → Rückfragen der
// Bieter mit KI-Entwurf und Freigabe → Bieterportal → Angebote (GAEB/PDF) einlesen → Preisspiegel.
// Aufruf: node 19-demo-lv-ki.mjs (braucht keine laufende Vorschau).
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { aufnahme } from './lib.mjs';

const K = 'LPH 6 + 7 · LV mit KI';
const { page, wait, hover, click, type, cap, capOff, card, snap, fertig, moveTo } =
  await aufnahme('19-demo-lv-ki', { profile: 'demo-lv-ki', frisch: true, kicker: K });
const DEMO = pathToFileURL(fileURLToPath(new URL('../prototyp/lv-ki.html', import.meta.url))).href + '#video';

// Platzhalterdateien mit den Namen der Unterlagen (Inhalt egal, der Prototyp liest nur den Namen)
const DIR = '/tmp/ava-videos/demo-unterlagen';
mkdirSync(DIR, { recursive: true });
const datei = (n) => { writeFileSync(`${DIR}/${n}`, 'Demo'); return `${DIR}/${n}`; };
const DOCS = ['Kita Sonnenhof Architektur Index B.ifc', 'A-201 Grundriss EG Index B.pdf', 'A-301 Schnitte.pdf', 'A-501 Türliste.xlsx',
  'Brandschutzkonzept Rev 1.pdf', 'Statik Positionsplan Decke.pdf', 'Baubeschreibung Kita Sonnenhof.docx'].map(datei);

const btn = (name) => page.getByRole('button', { name, exact: true });
const zeile = (oz) => page.locator(`#lvgrid tr.pos[data-oz="${oz}"]`);
const R = { side: 'right' };

await page.goto(DEMO);
await page.waitForSelector('#btn-ki');
await wait(400);

// 0 Titel
await card(`<div class="k">Demo · Leistungsphase 6 und 7</div><h1>Vom Modell zum Preisspiegel</h1>
<ul><li><b>IFC-Modell und Pläne</b> einlesen, alte LVs aus ORCA AVA oder California übernehmen</li>
<li>Gewerke paketieren, LV erstellen mit <b>Ihrem Regelwerk und Ihren Standardtexten</b></li>
<li>Fachplaner angebunden, Schnittstellen über alle LVs geprüft</li>
<li>Rückfragen der Bieter: Die KI entwirft, Sie geben frei</li>
<li>Angebote als GAEB oder PDF automatisch eingelesen, Preisspiegel fertig</li></ul>
<p>Projekt <b>Kita Sonnenhof</b>, Gewerk <b>Trockenbau</b>. <span style="color:#a1a1aa">Firmen, Mengen und Preise sind Beispielwerte.</span></p>`, 7000);

// 1 Unterlagen
await hover(page.locator('.conn'));
await click(page.locator('#btn-ki'), { pause: 500 });
await cap('Schritt 1 · Unterlagen', 'IFC-Modell, Pläne und Baubeschreibung hochladen. Pläne und LVs der Fachplaner kommen automatisch über den Sync dazu.', { ms: 700 });
const fc = page.waitForEvent('filechooser');
await click(page.locator('label.btn', { hasText: 'Dateien hinzufügen' }), { pause: 100 });
await (await fc).setFiles(DOCS);
await wait(3600);
await cap('Schritt 1 · Alte LVs', 'Frühere LVs direkt aus ORCA AVA oder California.pro übernehmen, mit Texten und Preisen.', { ms: 300 });
await click(page.locator('#btn-import'), { pause: 900 });
await click(page.locator('#import-go'), { pause: 1700 });
await snap('unterlagen');
await click(btn('Weiter'), { pause: 400 });

// 2 Wissen und Regeln
await hover(page.locator('#src-regel'));
await cap('Schritt 2 · Regelwerk und Textdatenbank', 'Die Standardtexte und Regeln Ihres Büros gelten automatisch, etwa Q3 in Aufenthaltsräumen oder keine Produktnamen. Dazu die Prüfung gegen VOB/C und Vergaberecht.', { ms: 4400 });
await snap('regelwerk');
await click(btn('Weiter'), { pause: 600 });

// 3 Gewerke
await cap('Schritt 3 · Gewerke', 'Aus dem IFC-Modell schlägt der Assistent die Vergabeeinheiten vor, mit Schnittstellen und Prüfung der Fachlose nach § 5 VOB/A.', { ms: 600 });
await hover(page.locator('#gtab tr[data-g="ti"]')); await wait(1500);
await hover(page.locator('#gtab tr[data-g="tb"]')); await wait(1700);
await snap('gewerke');
await click(btn('Weiter'), { pause: 400 });

// 4 Rückfragen
await cap('Schritt 4 · Rückfragen', 'Nur was offen ist, wird gefragt, mit Fundstelle und Vorschlag.', { ms: 1600 });
await click(btn('✦ LV erstellen'), { pause: 200 });

// 5 Erstellen
const p1 = page.evaluate(() => gen.p1);
await cap('Mengen aus dem 3D-Modell', 'Der Assistent erkennt Wände, Türen, Anschlüsse und Decken im Modell und misst die Mengen nach VOB/C. Jede Menge bleibt nachvollziehbar.', { ms: 4600, ...R });
await p1;
await snap('mengen');
const p23 = page.evaluate(async () => { await gen.phase2(); await gen.phase3(); });
await cap('Positionen', 'Aus jedem Bauteil wird eine Position. Dazu die losen Positionen aus den Plänen der Fachplaner, Ihre Standardtexte und Ihre Antworten.', { ms: 4800, ...R });
await p23;
await snap('lose');
const p4 = page.evaluate(() => gen.phase4());
await cap('Prüfen', 'VOB/C, Vergaberecht, Büro-Regelwerk und Lücken. Hier wird zum Beispiel der Stundenlohn nach Ihrer Regel auf 2 % begrenzt.', { ms: 2200, ...R });
await p4;
await wait(300);
await click(btn('LV öffnen'), { pause: 800 });

// 6 LV
await click(zeile('02.01'), { pause: 500 });
await cap('Das LV', 'Bewusst schlicht: ein normales LV mit einer Spalte Herkunft. Langtext und Mengenermittlung zeigt ein Klick auf die Position.', { ms: 4000, ...R });
await snap('lv');
await click(zeile('02.01'), { pause: 200 });
await click(page.locator('#side .pr[data-k="lk"]'), { pause: 300 });
await cap('Prüfung', 'Rechts kompakt alle Prüfungen. Aufgeklappt: fünf Lücken geschlossen, die sonst Nachträge geworden wären.', { ms: 2800 });

// 7 Fachplaner
await click(page.locator('#r-fp'), { pause: 400 });
await cap('Fachplaner', 'Elektro, Blitzschutz und TGA liefern Pläne und eigene LVs, als GAEB oder PDF. Alles bleibt synchron, jeder sieht nur seinen Teil.', { ms: 3600 });
await click(page.locator('#stab tr[data-s="s2"]'), { pause: 300 });
await cap('Schnittstellenprüfung', 'Der Assistent gleicht alle LVs ab: doppelt ausgeschrieben, Mengen aus altem Planstand, fehlende Anschlüsse. Die Nachricht an den Fachplaner ist vorbereitet.', { ms: 4600, ...R });
await snap('fachplaner');
await click(page.locator('#fp-go'), { pause: 500 });

// 8 Datenschutz
await click(page.locator('#r-ds'), { pause: 300 });
await cap('Datenschutz', 'Server in Deutschland, kein Training mit Ihren Daten, Rechte je Projekt und Rolle.', { ms: 3200, ...R });
await snap('datenschutz');
await moveTo(900, 500); await page.mouse.click(900, 500); await capOff();

// 9 Pläne ändern sich
await card(`<div class="k">Zwei Wochen später</div><h1>Die Pläne haben sich geändert</h1><p>Neuer Modellstand mit einer zusätzlichen Trennwand, mehr Dosen im Elektroplan, Technikraum jetzt EI 90.</p>`, 3200);
await click(page.locator('#r-lv'), { pause: 300 });
await click(btn('↻ Unterlagen aktualisieren'), { pause: 300 });
await cap('Neue Planstände', 'Das neue Modell und der Elektroplan über den Fachplaner-Sync sind schon da. Die Änderung ist im Modell markiert.', { ms: 3200 });
await snap('rerun');
await click(btn('LV anpassen'), { pause: 1500 });
await cap('Änderungen', 'Vier Mengen geändert, eine Position neu, dezent markiert. Eigene Änderungen bleiben erhalten.', { ms: 3000, ...R });
await click(btn('Alle übernehmen'), { pause: 400 });

// 10 Senden
await click(btn('Senden'), { pause: 600 });
await cap('Senden', 'Veröffentlichung auf der Vergabeplattform und Versand an den Verteiler in einem Schritt. Angebote bleiben bis zur Eröffnung verschlossen.', { ms: 3600 });
await snap('senden');
await click(page.locator('#senden-go'), { pause: 3200 });
await capOff();

// 11 Rückfragen der Bieter
await card(`<div class="k">Eine Woche später</div><h1>Die Bieter haben Rückfragen</h1><p>Mail, Bieterportal und Vergabeplattform laufen in einem Postfach zusammen.</p>`, 2800);
await click(page.locator('#lv-tabs button[data-t="bi"]'), { pause: 200 });
const ein = page.evaluate(() => posteingang());
await cap('Postfach', 'Rückfragen, Absagen und offene Bieter. Für jede Nachricht liegt nach Sekunden ein Antwortentwurf bereit.', { ms: 3600 });
await ein;
await click(page.locator('.mrow[data-m="m1"]'), { pause: 300 });
await cap('Antwort mit Kontext', 'Der Entwurf stützt sich auf LV-Position, Lüftungsplan, Brandschutzkonzept und Modell. Rechts steht, woher jede Aussage kommt.', { ms: 4200, ...R });
await snap('antwort');
await hover(page.locator('#bside .ctx.ok').first());
await cap('Vergaberecht', 'Die Antwort geht als Bieterinformation an alle Bieter und auf die Plattform, ohne Namen des Fragestellers (§ 12a VOB/A).', { ms: 3800, ...R });
await click(page.locator('#bi-edit'), { pause: 200 });
await cap('Human in the Loop', 'Nichts geht ohne Freigabe raus. Der Architekt ergänzt einen Satz und gibt frei.', { ms: 200 });
await type(' Ein Fabrikat ist nicht vorgegeben.', 34);
await wait(300);
await click(page.locator('#bi-go'), { pause: 1500 });
await click(page.locator('.brow[data-b="Trockenbau Meier KG"]'), { pause: 400 });
await cap('Übersicht je Bieter', 'Wer hat abgerufen, gefragt, welche Bieterinfo erhalten. Absagen erkennt die KI, Erinnerungen sind vorbereitet.', { ms: 4000, ...R });
await snap('bieter');
await capOff();

// 12 Bieterportal
await card(`<div class="k">Sicht des Bieters</div><h1>Angebot abgeben</h1><p>Im Bieterportal oder auf der Vergabeplattform: Preise eintragen oder die Kalkulation als GAEB X84 oder PDF hochladen. Beides wird synchronisiert.</p>`, 3600);
await page.evaluate(() => zeige('portal'));
await wait(400);
await click(page.locator('#btn-x84'), { pause: 1400 });
await click(page.locator('#btn-abgeben'), { pause: 1600 });
await snap('portal');

// 13 Eröffnung, Angebote einlesen, Preisspiegel
await card(`<div class="k">17.11., 12:00 · Eröffnungstermin</div><h1>Angebote automatisch einlesen</h1><p>Die Angebote werden geöffnet und eingelesen, egal ob GAEB, PDF oder direkt eingetragen.</p>`, 3000);
await page.evaluate(() => { zeige('lv'); showTab('ps'); });
await wait(200);
const ps = page.evaluate(() => eingang());
await wait(1300);
await cap('PDF-Angebot', 'Jeder Preis wird erkannt und der richtigen Position zugeordnet. Summe und Auffälligkeiten werden geprüft.', { ms: 3300, ...R });
await snap('einlesen');
await ps;
await cap('Preisspiegel', 'Bester Preis grün, Ausreißer rot, fehlende Preise markiert. Rechts die Hinweise für die Prüfung.', { ms: 3800, ...R });
await snap('preisspiegel');
await capOff();

await card(`<div class="k">Zusammenfassung</div><h1>Vom Modell zum Preisspiegel</h1>
<ul><li><b>IFC-Modell</b>, Pläne und alte LVs aus ORCA AVA oder California</li>
<li>Gewerke paketiert, LV mit <b>Ihrem Regelwerk</b> erstellt und geprüft</li>
<li>Fachplaner synchron, Schnittstellen über alle LVs geprüft</li>
<li>Rückfragen mit Kontext beantwortet, gesendet erst nach Freigabe</li>
<li>Angebote aus Portal und Plattform automatisch im Preisspiegel</li>
<li>Daten in Deutschland, kein Training mit Ihren Daten</li></ul>`, 6000);
await fertig();
