# plua ai · Website

One-Pager für plua ai: Next.js (App Router), statischer Export, keine weiteren Abhängigkeiten.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # fertige Seite in ./out (auf jeden Webspace, Vercel, Netlify)
```

## Aufbau

| Datei | Inhalt |
|---|---|
| `app/page.tsx` | Die Seite: Hero als Planblatt (Raster in zwei Stärken, Grundriss, der sich zeichnet) mit Demo-Video, Laufband mit Werkzeugen, große Scroll-Animation in vier Takten, Grundsatz, Datenschutz, Pilot |
| `components/Fluss.tsx`, `FlussScroll.tsx` | Die große Scroll-Animation in vier Takten: 1 Daten aus CAD/BIM, alten LVs, Fachplanern und Regelwerk · 2 Modell mit Mengen · 3 Positionen in der Reihenfolge, in der sie erkannt werden, dann nach Gewerken sortiert und nummeriert, das Trockenbau-LV wird zur Karte der Vergabe · 4 Vergabe als ein durchgehender Fluss (Versand an die Bieter, Rückfragen mit Freigabe, Angebote kommen ins Postfach und wandern von dort in ihre Spalte des Preisspiegels). Die Bühne bleibt beim Scrollen stehen, `FlussScroll` setzt den Fortschritt als `--P`, jeder Takt rechnet daraus seine eigene Zeitleiste `--p`. Eigenes Hochformat-Layout fürs Handy |
| `components/Animationen.tsx` | Nicht mehr eingebunden (frühere Einzel-Animationen), kann gelöscht werden |
| `app/globals.css` | Gestaltung. Farben als Tokens oben, heller und dunkler Modus automatisch |
| `lib/content.ts` | Alle Texte, Integrationen, Ablauf, Prüfprotokoll, Datenschutz, Kontaktadresse |
| `components/Icons.tsx` | Logo plua ai und neutrale Symbole je Kategorie |
| `public/demo.mp4` | Demo-Video (1280 × 800, 2:49) mit Standbild `demo-poster.webp` |

## Logos der Integrationen

Die Kacheln zeigen bewusst neutrale Symbole je Kategorie, keine Markenlogos. Wer ein Logo zeigen darf (Freigabe
des Herstellers oder Partnerprogramm), legt die Datei unter `public/logos/` ab und trägt sie in `lib/content.ts` ein:

```ts
{ id: 'orca', name: 'ORCA AVA', note: 'LVs und Preise importieren', glyph: 'ava', logo: '/logos/orca.svg' },
```

## Vor dem Livegang

- `KONTAKT_EMAIL` in `lib/content.ts` prüfen (Platzhalter `hallo@plua.ai`).
- Integrationen und Datenschutz-Aussagen mit dem tatsächlichen Stand abgleichen. Die Fußnote im Abschnitt
  Integrationen sagt bereits, dass einige Anbindungen in Entwicklung sind.
- Impressum und Datenschutzerklärung ergänzen (Pflicht für eine deutsche Website).
