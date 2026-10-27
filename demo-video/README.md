# Demo-Video „LV mit KI erstellen“

Stand 27.10.2026 · Simon Röhrl · Fassung 3

Ein Demo-Video (2:49 min) zeigt die Zielvision für LV-Erstellung und Vergabe in ava: vom IFC-Modell über das geprüfte LV,
die Fachplaner und die Rückfragen der Bieter bis zum Preisspiegel. Idee, Ablauf und alle Einblendungen stehen in
[`IDEE.md`](IDEE.md).

> **Wichtig:** Das Video zeigt **nicht die echte App**, sondern einen klickbaren Prototyp. IFC-Import, Import aus ORCA AVA
> und California, Gewerke-Paketierung, Fachplaner-Sync, Schnittstellenprüfung, Vergabeplattform-Sync, Bieterkommunikation
> und das Einlesen von PDF-Angeboten gibt es in der App noch nicht. Alle Firmen, Mengen und Preise sind Beispielwerte
> (Projekt „Kita Sonnenhof“, Gewerk Trockenbau). Die Aussagen zum Datenschutz vor Veröffentlichung mit dem tatsächlichen
> Setup abgleichen.

## Inhalt

| Ordner / Datei | Was |
|---|---|
| `video/19-demo-lv-ki.mp4` | Das fertige Video, 1440 × 900, H.264, 2:49 min |
| `IDEE.md` | Idee, Kernbotschaften, Storyboard mit allen Einblendungstexten |
| `bilder/` | 15 Standbilder der wichtigsten Szenen (gleiche Reihenfolge wie im Video) |
| `prototyp/lv-ki.html` | Der klickbare Prototyp, eine einzige HTML-Datei (CSS und JS inline, keine Abhängigkeiten außer der Schrift) |
| `prototyp/fonts/` | Schrift Inter (SIL Open Font License, Lizenz liegt bei) |
| `aufnahme/` | Playwright-Skript, das den Prototyp bedient und das Video aufnimmt (`19-demo-lv-ki.mjs`, Hilfsfunktionen in `lib.mjs`) |
| `alt/` | Frühere Fassungen: v1 (3:31 min) und v2 (1:57 min) mit ihren Standbildern |

## Prototyp ansehen

`prototyp/lv-ki.html` im Browser öffnen (Chrome, Fenster ca. 1440 × 900) und durchklicken. Echte Dateien muss man nirgends
auswählen, der Prototyp fügt die Beispielunterlagen selbst ein.

1. **„✦ LV mit KI erstellen“** → „Dateien hinzufügen“ (IFC-Modell und Pläne, die Fachplaner-Unterlagen kommen automatisch
   dazu) → **„⇄ Aus ORCA AVA / California“** → „3 LVs importieren“.
2. **Wissen & Regeln** (Büro-Regelwerk und Textdatenbank) → **Gewerke**: mit der Maus über eine Vergabeeinheit fahren, das
   3D-Modell zeigt sie → **Rückfragen** → **„✦ LV erstellen“**. Die Phasen laufen automatisch ab (ca. 40 s), oben rechts im
   Plan zwischen „3D-Modell“ und „Grundriss“ umschalten. Dann „LV öffnen“.
3. Im LV: Zeile anklicken → Langtext, Herkunft, Mengenermittlung. EP anklicken → bearbeiten. Rechts eine Prüfung aufklappen,
   Eintrag anklicken → Position wird markiert.
4. Leiste links: **Fachplaner** (Kettensymbol) → Schnittstelle anklicken → Vorschlag und Nachricht an den Fachplaner.
   **Datenschutz** (Schild unten) und **Regelwerk** (Buch) öffnen je ein kleines Fenster.
5. Zurück zum LV (Listensymbol) → **„↻ Unterlagen aktualisieren“** → „LV anpassen“ → „Alle übernehmen“.
6. **„Senden“** → „Veröffentlichen und senden“. Der blaue Link in der Mail öffnet das **Bieterportal** (Sicht des Bieters):
   „GAEB X84 oder PDF hochladen“ füllt alle Preise, dann „Angebot verschlüsselt abgeben“ und „← Zurück“.
7. Reiter **„Bieter & Rückfragen“**: Nachrichten laufen ein, Nachricht anklicken → Entwurf, Kontext, Vergabeprüfung →
   „✎ Bearbeiten“ → „Freigeben und senden“. Links einen Bieter anklicken → Verlauf.
8. Reiter **„Preisspiegel“**: Angebote laufen ein, das PDF-Angebot von Meier wird sichtbar eingelesen
   („In den Preisspiegel übernehmen“), rechts die Auswertung.

Neu laden setzt alles zurück.

## Video neu aufnehmen

Voraussetzungen: Node.js 20 oder neuer, Google Chrome, `ffmpeg` (z. B. `brew install ffmpeg`).

```
cd aufnahme
npm install
npm run aufnahme        # → ../video/19-demo-lv-ki.mp4 (dauert ca. 4 min, läuft unsichtbar im Hintergrund)
npm run kontrollbilder  # wie oben, legt zusätzlich Standbilder in ../bilder-neu ab
```

Das Skript öffnet `prototyp/lv-ki.html#video`. Mit `#video` wartet der Prototyp auf das Skript, statt die Abläufe selbst
abzuspielen, und alle Animationen laufen schneller (`TEMPO = 0.55`). Ohne Chrome: `npx playwright install chromium`, dann
`OHNE_CHROME=1 npm run aufnahme`.

## Fassung für die Website

`npm run aufnahme` erzeugt den **Master** (`video/19-demo-lv-ki.mp4`, 1440 × 900, ca. 700 kbit/s). Die Datei, die auf
plua.ai ausgeliefert wird, ist eine daraus kodierte, kleinere Fassung — dieser Schritt war früher nirgends festgehalten
und hat das Video einmal auf 1280 × 800 bei 138 kbit/s gedrückt (SSIM 0,977 gegenüber dem Master, sichtbar matschig).
Deshalb hier der Befehl, mit dem die aktuelle Fassung entstanden ist:

```
ffmpeg -i video/19-demo-lv-ki.mp4 \
  -c:v libx264 -preset veryslow -crf 23 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart -an ../public/demo.mp4
```

Ergebnis: 1440 × 900, ca. 474 kbit/s, 10,0 MB, SSIM 0,9975 gegenüber dem Master — praktisch deckungsgleich.
**Nicht** herunterskalieren und **nicht** unter CRF 23 gehen: Bildschirmaufnahmen mit viel Text vertragen das schlecht.
Mit `-crf 26` landet man bei ca. 6 MB, falls die Seite leichter werden soll.

Zur Auflösung: Playwright nimmt in **CSS-Pixeln** auf. `deviceScaleFactor` erhöht die Auflösung der Aufnahme nicht —
`recordVideo.size` füllt einen größeren Rahmen nur mit Grau auf. Ein größeres Viewport bringt hier ebenfalls nichts,
weil der Prototyp auf `max-width: 1120px` zentriert ist und nur mehr leerer Rand dazukäme. Schärfer wird es nur über
ein Viewport von 2880 × 1800 zusammen mit `document.documentElement.style.zoom = 2`: Der Prototyp nutzt keine
`vw`/`vh`-Einheiten, das Layout bleibt dabei also erhalten (geprüft, SSIM 0,977). Dafür müssten die Koordinaten in
`lib.mjs` mitskaliert werden — `boundingBox()` liefert den gezoomten Raum, `#__cursor` und `#__hl` liegen darin —
und die feste Koordinate in `19-demo-lv-ki.mjs:106` angepasst werden.

## Anpassen

- **Einblendungen, Reihenfolge, Tempo:** `aufnahme/19-demo-lv-ki.mjs`. `cap(titel, text, { ms, side })` blendet einen Text
  für `ms` Millisekunden ein (`side: 'right'` = rechts unten), `card(html, ms)` zeigt eine Vollbild-Titelkarte. Aussehen der
  Einblendungen in `lib.mjs`.
- **Daten** oben im `<script>` von `prototyp/lv-ki.html`: Unterlagen (`DOCS`, `FACHDOCS`, `OLD`, `NEWDOCS`), Bauteile und
  Positionen (`BAUTEILE`, `POS`), Rückfragen (`FRAGEN`), Gewerke (`GEWERKE`), Prüfungen (`CHECKS`, `PRUEF`), Fachplaner und
  Schnittstellen (`FP`, `SCHN`), Bieter und Nachrichten (`BIETER`, `BI`, `MSGS`), Preise (`FAKT`, `KANAL`).
- **3D-Modell:** `buildModel()` erzeugt aus `WALLS` und `DOORS` einfache Quader (20 px je Meter), `render3d()` projiziert und
  zeichnet sie als SVG. Farben je Modus in `farbe()`.
- Bieterpreise entstehen aus der Schätzung × einem festen Faktor je Bieter (`FAKT`), damit jede Aufnahme gleich aussieht.
