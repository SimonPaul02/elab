// Große, scrollgesteuerte Animation „Vom Modell zum LV“. Die Bühne bleibt beim Scrollen stehen (sticky), der
// Scrollfortschritt steht als CSS-Variable --p (0 bis 1) auf der Section (gesetzt von FlussScroll). Jedes Element
// bekommt ein Zeitfenster (--s Start, --d Dauer, optional --s2/--d2 zum Ausblenden); alles Weitere rechnet das CSS.
// Zwei Layouts: quer (Desktop, Tablet) und hoch (Handy).
import type { CSSProperties, ReactElement } from 'react';

type Pt = [number, number];
type Pt3 = [number, number, number]; // u, v, z-Anteil im Modell
const v = (o: Record<string, number | string>) => o as CSSProperties;
const pts = (p: Pt[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// Wand: u1, v1, u2, v2, Art. 'hinten' = Außenwand hinten (volle Höhe, mit Fenstern), 'vorne' = Außenwand vorne
// (im Schnitt, niedrig, damit man ins Haus sieht), 'innen' = Trockenbauwand
type Art = 'hinten' | 'vorne' | 'innen';
type Wand = [number, number, number, number, Art];
const WAENDE: Wand[] = [
  [0, 0, 10, 0, 'hinten'], [0, 0, 0, 6, 'hinten'], [10, 0, 10, 6, 'vorne'], [0, 6, 10, 6, 'vorne'],
  [4, 0, 4, 6, 'innen'], [4, 3, 10, 3, 'innen'], [7, 0, 7, 3, 'innen'], [8.5, 3, 8.5, 6, 'innen'],
];
// Fenster in den hinteren Außenwänden: Wand v = 0 (entlang u) und Wand u = 0 (entlang v), von bis, Höhe als Anteil
const FENSTER: { wand: 'v0' | 'u0'; a: number; b: number }[] = [
  { wand: 'v0', a: 1.1, b: 2.7 }, { wand: 'v0', a: 5.0, b: 6.3 }, { wand: 'v0', a: 7.8, b: 9.3 },
  { wand: 'u0', a: 1.0, b: 2.4 }, { wand: 'u0', a: 3.8, b: 5.2 },
];
function prismen(P: (u: number, v: number, z?: number) => Pt, w: Wand, h: number, t = 0.16) {
  const [u1, v1, u2, v2] = w, horiz = v1 === v2, L = horiz ? u2 - u1 : v2 - v1, n = Math.max(1, Math.ceil(L / 2));
  const out: { d: number; f: string; e: string; t: string }[] = [];
  for (let i = 0; i < n; i++) {
    const a = i / n, b = (i + 1) / n;
    if (horiz) {
      const ua = u1 + L * a, ub = u1 + L * b, q = v1;
      out.push({ d: (ua + ub) / 2 + q, f: pts([P(ua, q + t / 2), P(ub, q + t / 2), P(ub, q + t / 2, h), P(ua, q + t / 2, h)]), e: pts([P(ub, q - t / 2), P(ub, q + t / 2), P(ub, q + t / 2, h), P(ub, q - t / 2, h)]), t: pts([P(ua, q - t / 2, h), P(ub, q - t / 2, h), P(ub, q + t / 2, h), P(ua, q + t / 2, h)]) });
    } else {
      const va = v1 + L * a, vb = v1 + L * b, u = u1;
      out.push({ d: u + (va + vb) / 2, f: pts([P(u + t / 2, va), P(u + t / 2, vb), P(u + t / 2, vb, h), P(u + t / 2, va, h)]), e: pts([P(u - t / 2, vb), P(u + t / 2, vb), P(u + t / 2, vb, h), P(u - t / 2, vb, h)]), t: pts([P(u - t / 2, va, h), P(u + t / 2, va, h), P(u + t / 2, vb, h), P(u - t / 2, vb, h)]) });
    }
  }
  return out;
}
function bez(p0: Pt, p1: Pt, p2: Pt, p3: Pt) {
  let L = 0, prev = p0;
  for (let i = 1; i <= 40; i++) {
    const t = i / 40, m = 1 - t;
    const q: Pt = [0, 1].map((k) => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]) as Pt;
    L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q;
  }
  return { d: `M ${p0.join(' ')} C ${p1.join(' ')} ${p2.join(' ')} ${p3.join(' ')}`, L: Math.ceil(L) };
}

const FARBE = { cad: 'var(--t-blue)', alt: 'var(--t-orange)', fach: 'var(--t-teal)', regel: 'var(--t-purple)' } as const;
type Gruppe = keyof typeof FARBE;
const TITEL: Record<Gruppe, string> = { cad: 'CAD UND BIM', alt: 'ALTE LVS', fach: 'FACHPLANER', regel: 'IHR REGELWERK' };

const ZEILEN: [string, string, string, Gruppe, string, Pt3 | null, number][] = [
  // Reihenfolge = so, wie plua ai die Positionen findet (gemischt). OZ = Nummer nach dem Sortieren im Gewerk.
  // OZ, Kurztext, Menge, Herkunft, Herkunftstext, Bauteil im Modell (u, v, z-Anteil), Gewerk (Index in GEWERKE)
  ['02.01', 'Ständerwand W1', '412,5 m²', 'cad', 'Modell', [4, 2, 1], 3],
  ['01.01', 'Fenster Holz-Alu', '12 St', 'cad', 'Modell', [1.9, 0.09, 0.57], 2],
  ['03.04', 'Hohlwanddosen', '71 St', 'fach', 'Elektro-LV', [4.09, 4.6, 0.22], 4],
  ['02.01', 'Dachdeckung Ziegel', '168 m²', 'cad', 'Modell', [5, 1.5, 1.71], 1],
  ['02.02', 'Flurwand EI 30', '186,2 m²', 'cad', 'Modell', [7, 3, 1], 3],
  ['01.01', 'Baustelleneinrichtung', '1 psch', 'alt', 'Büro-LV', [10, 6, 0], 0],
  ['03.01', 'Akustikdecke D1', '520 m²', 'cad', 'Modell', [2, 3, 0], 3],
  ['03.02', 'Außenwand Mauerwerk', '236 m²', 'cad', 'Modell', [0.09, 4.4, 0.8], 0],
  ['03.03', 'Revisionsöffnung EI 30', '18 St', 'fach', 'TGA-Plan', [7.09, 1.5, 0.75], 3],
  ['04.01', 'Dachrinne Titanzink', '26 m', 'cad', 'Modell', [8, -0.35, 0.83], 1],
  ['02.04', 'Zulage Wandhöhe > 3 m', '74,8 m²', 'cad', 'Modell', [4, 0.8, 1], 3],
  ['02.05', 'Türöffnung', '34 St', 'cad', 'Modell', [5.6, 3, 0.45], 3],
];
// Gewerke (Fachlose) in LV-Reihenfolge: Name, LV, Positionen gesamt, Farbe. Trockenbau (Index 3) geht danach in die Vergabe.
const GEWERKE: [string, string, number, string][] = [
  ['Rohbau', 'LV 012', 41, 'var(--t-brown)'], ['Dach', 'LV 022', 28, 'var(--t-rose)'], ['Fenster', 'LV 031', 14, 'var(--t-teal)'],
  ['Trockenbau', 'LV 039', 19, 'var(--t-blue)'], ['Elektro', 'LV 053', 64, 'var(--t-yellow)'],
];
const TB = 3;
// Plätze nach dem Sortieren: je Gewerk eine Kopfzeile, darunter die Positionen nach OZ
function sortiert(step: number, kopf: number) {
  const zeile: number[] = new Array(ZEILEN.length).fill(0), koepfe: number[] = [];
  let y = 0;
  GEWERKE.forEach((_, g) => {
    koepfe.push(y); y += kopf;
    ZEILEN.map((z, i) => [z, i] as const).filter(([z]) => z[6] === g).sort((a, b) => a[0][0].localeCompare(b[0][0]))
      .forEach(([, i]) => { zeile[i] = y; y += step; });
  });
  return { zeile, koepfe };
}

type Layout = {
  name: 'quer' | 'hoch'; W: number; H: number; cap: Pt; chipH: number; chipF: number; chipGap: number;
  gruppen: Record<Gruppe, { x: number; y: number; cols: number; colW: number; items: string[]; anker: Pt }>;
  k: number; ox: number; oy: number; zentrum: Pt; move: { dx: number; dy: number; s: number };
  tags: [string, number, number][];
  rows: { x: number; y0: number; step: number; kopf: number; w: number; oz: number; txt: number; menge: number };
  summe: Pt; badges: boolean;
  box: [number, number, number]; // Box der Takt-4-Bühne (tx, ty, Maßstab)
};

const QUER: Layout = {
  name: 'quer', W: 1200, H: 700, cap: [60, 64], chipH: 28, chipF: 7.1, chipGap: 34,
  gruppen: {
    cad: { x: 60, y: 150, cols: 2, colW: 150, items: ['Revit', 'Archicad', 'Allplan', 'Vectorworks', 'IFC 4', 'AutoCAD · DWG'], anker: [370, 214] },
    alt: { x: 880, y: 150, cols: 2, colW: 150, items: ['ORCA AVA', 'California.pro', 'GAEB X83 · X86', 'PDF-LVs'], anker: [870, 200] },
    fach: { x: 60, y: 470, cols: 1, colW: 0, items: ['Elektro · LV 053', 'Blitzschutz · LV 050', 'TGA · Pläne', 'Tragwerk'], anker: [262, 540] },
    regel: { x: 900, y: 470, cols: 1, colW: 0, items: ['Q3 in Aufenthaltsräumen', 'Keine Produktnamen', 'Stundenlohn ≤ 2 %', '142 Standardtexte'], anker: [890, 540] },
  },
  k: 24, ox: 558.4, oy: 330, zentrum: [600, 410], move: { dx: -290, dy: 0, s: 1 },
  tags: [['Dach · 168 m²', 590, 200], ['12 Fenster', 318, 296], ['W1 · 412,5 m²', 700, 410], ['D1 · 520 m²', 450, 560]],
  rows: { x: 600, y0: 112, step: 32, kopf: 22, w: 560, oz: 14, txt: 66, menge: 540 },
  summe: [600, 640], badges: true,
  box: [270, 146, 1.18],
};
const HOCH: Layout = {
  name: 'hoch', W: 420, H: 760, cap: [16, 40], chipH: 24, chipF: 6.4, chipGap: 30,
  gruppen: {
    cad: { x: 16, y: 104, cols: 1, colW: 0, items: ['Revit · Archicad', 'Allplan · Vectorworks', 'IFC · DWG'], anker: [100, 212] },
    alt: { x: 216, y: 104, cols: 1, colW: 0, items: ['ORCA AVA', 'California.pro', 'GAEB · PDF'], anker: [300, 212] },
    fach: { x: 16, y: 590, cols: 1, colW: 0, items: ['Elektro · LV 053', 'Blitzschutz · LV 050', 'TGA · Pläne'], anker: [100, 584] },
    regel: { x: 216, y: 590, cols: 1, colW: 0, items: ['Q3 Aufenthaltsräume', 'Keine Produktnamen', 'Stundenlohn ≤ 2 %'], anker: [300, 584] },
  },
  k: 15, ox: 184, oy: 360, zentrum: [210, 410], move: { dx: 0, dy: -228, s: 0.72 },
  tags: [['Dach · 168 m²', 190, 268], ['12 Fenster', 16, 340], ['W1 · 412,5 m²', 286, 352], ['D1 · 520 m²', 60, 500]],
  rows: { x: 16, y0: 262, step: 28, kopf: 20, w: 388, oz: 10, txt: 52, menge: 376 },
  summe: [16, 718], badges: false,
  box: [0, 240, 0.75],
};


// ---------- Takt 4: Versand, Rückfragen und Angebote als ein durchgehender Fluss (--p lokal 0 bis 1), Box 560 × 440 ----------
type Kap = [string, string, number, number | null];
const KAPITEL = '09'; // Kapitel insgesamt: 5 bis zum fertigen LV, 4 in der Vergabe
function Takt({ L, nr, start, dauer, caps, ende = false, children }: { L: Layout; nr: number; start: number; dauer: number; caps: Kap[]; ende?: boolean; children: ReactElement }) {
  const box = `translate(${L.box[0]} ${L.box[1]}) scale(${L.box[2]})`;
  const q = L.name === 'quer';
  return (
    <g className={`fx-takt${ende ? ' ende' : ''}`} style={v({ '--p': `calc((var(--P, 0) - ${start}) / ${dauer})` })}>
      {caps.map(([t, sub, s, s2], k) => (
        <g key={t} className="fx fx-cap" style={v({ '--s': s, '--d': 0.03, ...(s2 !== null ? { '--s2': s2, '--d2': 0.025 } : {}) })}>
          <text x={L.cap[0]} y={L.cap[1] - (q ? 20 : 14)} className="f-kap">{`0${nr + k} / ${KAPITEL}`}</text>
          <text x={L.cap[0]} y={L.cap[1] + (q ? 12 : 8)} className="f-cap">{t}</text>
          <text x={L.cap[0]} y={L.cap[1] + (q ? 40 : 28)} className="f-sub">{sub}</text>
        </g>
      ))}
      <g transform={box}>{children}</g>
    </g>
  );
}
const cw = (n: string) => Math.round(n.length * 7.6 + 30);
function Chip({ n, x, y, farbe, s, d = 0.05 }: { n: string; x: number; y: number; farbe: string; s: number; d?: number }) {
  return (
    <g className="fx fx-in" style={v({ '--s': s, '--d': d })}>
      <rect x={x} y={y} width={cw(n)} height={28} rx={7} className="f-chip" />
      <circle cx={x + 12} cy={y + 14} r={3.6} style={{ fill: farbe }} />
      <text x={x + 22} y={y + 18.5} className="b-chip">{n}</text>
    </g>
  );
}
function reiheMitte(namen: string[], breite: number, gap = 8) {
  const w = namen.map(cw), tot = w.reduce((a, b) => a + b, 0) + gap * (namen.length - 1);
  let x = (breite - tot) / 2;
  return namen.map((n, i) => { const r = { n, x }; x += w[i] + gap; return r; });
}

const KAP_VERGABE: Kap[] = [
  ['Raus an alle Bieter.', 'Ein Klick: Vergabeplattform, Bieterportal und Mail.', 0, 0.12],
  ['Rückfragen mit Freigabe.', 'Die KI entwirft jede Antwort mit Quellen. Sie geben frei.', 0.14, 0.4],
  ['Die Angebote kommen zurück.', 'GAEB, PDF oder Portal. Alles landet im selben Postfach.', 0.42, 0.6],
  ['Preisspiegel, Position für Position.', 'Jedes Angebot automatisch eingetragen und verglichen.', 0.62, null],
];
type ZelleT = [string, '' | 'best' | 'abw' | 'alt' | 'fehlt' | 'aus'];
const BIETER = ['Bauer', 'Meier', 'Schmid', 'Huber'];
const FORMAT = ['X84', 'PDF', 'Portal', 'X84'];
const COLX = [168, 266, 364, 462], CW = 92, ZY = (r: number) => 70 + r * 42;
const SPIEGEL: [string, string, ZelleT[]][] = [
  ['02.01', 'Ständerwand', [['66,32', ''], ['64,24', 'best'], ['68,24', ''], ['73,85', '']]],
  ['02.04', 'Zulage Höhe', [['9,27', ''], ['8,98', 'best'], ['9,54', ''], ['13,40 ↑', 'abw']]],
  ['03.01', 'Akustikdecke', [['69,30', 'best'], ['Alt. 61,90', 'alt'], ['70,78', ''], ['76,81', '']]],
  ['03.03', 'Revision', [['139,59', 'best'], ['377,00 ↑', 'abw'], ['142,59', ''], ['154,74', '']]],
  ['01.03', 'Gerüst', [['1.110', 'best'], ['1.210', ''], ['fehlt', 'fehlt'], ['1.194', '']]],
  ['04.02', 'Abschottung', [['39,89', 'best'], ['45,31', ''], ['47,15', ''], ['ausgeschlossen', 'aus']]],
];

function TaktVergabe() {
  const mitte = (b: number) => COLX[b] + CW / 2;
  // A: Versand
  const kanaele = reiheMitte(['DTVP', 'evergabe.de', 'Bieterportal', 'Outlook'], 560);
  const kFarbe = ['var(--t-purple)', 'var(--t-purple)', 'var(--accent)', 'var(--t-teal)'];
  const versand = BIETER.map((_, b) => bez([150, 40], [200, 118], [mitte(b) - 30, 104], [mitte(b), 36]));
  // B: Rückfragen
  const fragen = [[1, 'Meier', 'Pos. 03.03 · Revisionsöffnung'], [3, 'Huber', 'Pos. 01.03 · Gerüst'], [2, 'Schmid', 'Bauabschnitte']] as const;
  // C: Angebote der Bieter ins Postfach, von dort in ihre Spalte des Preisspiegels
  const s1 = (b: number) => 0.42 + b * 0.025, s2 = (b: number) => 0.59 + b * 0.012, s3 = (b: number) => 0.64 + b * 0.03;
  const yOben = 52, yUnten = 300, slotY = 124, slotX = (b: number) => 214 + b * 62;
  const cls = { '': 'b-zelle', best: 'b-zelle', abw: 'a-z-abw', alt: 'a-z-alt', fehlt: 'a-z-fehlt', aus: 'a-z-aus' } as const;
  const tcls = { '': 'a-mono', best: 'a-mono', abw: 'a-mono a-b a-abwt', alt: 'a-klein a-altt', fehlt: 'a-klein a-fixt', aus: 'a-klein a-dim0' } as const;
  let n = 0;
  const legende = [['22/24 bepreist', 'ok'], ['2 Abweichungen', 'abw'], ['1 Alternative', 'alt'], ['1 fehlt', 'fehlt'], ['1 ausgeschlossen', 'aus']] as const;
  let lx = 0;
  const leg = legende.map(([t, k], i) => { if (i === 3) lx = 0; const x = lx; lx += Math.round(t.length * 6.6 + 40); return { t, k, x, y: i < 3 ? 330 : 356 }; });
  const haken = (x: number, y: number) => <path d={`M ${x - 3.5} ${y} l 2.5 2.5 l 4.5 -5`} style={{ fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} />;
  return (
    <g>
      {/* LV, bleibt die ganze Zeit stehen */}
      <PaketKarte />
      {kanaele.map((k, i) => <Chip key={k.n} n={k.n} x={k.x} y={404} farbe={kFarbe[i]} s={0.03 + i * 0.015} d={0.03} />)}

      {/* A: Versand an die Bieter */}
      {versand.map((w, b) => (
        <g key={b}>
          <path d={w.d} className="fx fx-draw f-fluss" style={v({ '--s': 0.04 + b * 0.015, '--d': 0.05, '--L': w.L, '--s2': 0.12, '--d2': 0.025, '--dim': 1 })} />
          <path d={w.d} className="fx fx-paket" style={v({ '--s': 0.055 + b * 0.015, '--d': 0.025, '--s2': 0.115, '--d2': 0.015, stroke: kFarbe[b] })} />
        </g>
      ))}

      {/* Bieter, später die Spaltenköpfe des Preisspiegels */}
      {BIETER.map((b, i) => (
        <g key={b}>
          <g className="fx fx-in" style={v({ '--s': 0.03 + i * 0.015, '--d': 0.035 })}>
            <rect x={COLX[i]} y={0} width={CW} height={34} rx={9} className="f-zeile" />
            <text x={mitte(i) - 7} y={22} className="a-txt a-b" textAnchor="middle">{b}</text>
          </g>
          <g className="fx fx-pop" style={v({ '--s': 0.35 + i * 0.01, '--d': 0.015 })}>
            <circle cx={COLX[i] + CW - 13} cy={17} r={7} className="b-haken" />
            {haken(COLX[i] + CW - 13, 17)}
          </g>
        </g>
      ))}

      {/* Postfach: erst Rückfragen, dann Angebote */}
      <g className="fx fx-in" style={v({ '--s': 0.14, '--d': 0.03, '--s2': 0.6, '--d2': 0.025 })}>
        <rect x={168} y={64} width={386} height={104} rx={10} className="f-zeile" />
        <text x={184} y={86} className="a-mono a-dim">POSTFACH · DTVP · OUTLOOK</text>
      </g>
      {fragen.map(([bi, nm, t], j) => {
        const ry = 108 + j * 22, s = 0.16 + j * 0.03;
        return (
          <g key={nm}>
            <g className="fx fx-flug" style={v({ '--s': s, '--d': 0.03, '--s2': s + 0.03, '--d2': 0.01, '--fx': mitte(bi) - 9 - 184, '--fy': 24 - (ry - 7) })}>
              <rect x={184} y={ry - 7} width={18} height={13} rx={2} className="a-brief" /><path d={`M 184 ${ry - 7} l 9 6.5 l 9 -6.5`} className="a-brieflinie" />
            </g>
            <g className="fx fx-in" style={v({ '--s': s + 0.03, '--d': 0.015, '--s2': 0.39, '--d2': 0.02 })}>
              <circle cx={190} cy={ry - 1} r={3} style={{ fill: 'var(--accent)' }} />
              <text x={202} y={ry + 3} className="a-klein"><tspan className="a-b" style={{ fill: 'var(--ink)' }}>{nm}</tspan> · {t}</text>
            </g>
          </g>
        );
      })}

      {/* B: Antwortentwurf mit Freigabe */}
      <g className="fx fx-fade" style={v({ '--s': -1, '--d': 0.01, '--s2': 0.38, '--d2': 0.025 })}>
        <g className="fx fx-in" style={v({ '--s': 0.25, '--d': 0.03 })}>
          <rect x={168} y={180} width={386} height={142} rx={12} className="a-entwurf" />
          <text x={184} y={205} className="a-txt a-b a-akz">✦ Antwortentwurf · Bieterinformation Nr. 1</text>
        </g>
        {[300, 250, 180].map((w, i) => <rect key={i} x={184} y={220 + i * 14} width={w} height={7} rx={3.5} className="fx fx-growx a-skel" style={v({ '--s': 0.27 + i * 0.015, '--d': 0.025 })} />)}
        {['LV 03.03', 'L-201', 'Brandschutz 4.2'].map((q, i) => (
          <g key={q} className="fx fx-pop" style={v({ '--s': 0.3 + i * 0.01, '--d': 0.015 })}>
            <rect x={184 + [0, 74, 136][i]} y={262} width={[66, 54, 112][i]} height={22} rx={6} className="a-quelle" />
            <text x={184 + [0, 74, 136][i] + [33, 27, 56][i]} y={277} className="a-klein a-blau" textAnchor="middle">{q}</text>
          </g>
        ))}
        <g className="fx fx-in" style={v({ '--s': 0.3, '--d': 0.015 })}>
          <rect x={422} y={288} width={118} height={26} rx={7} className="b-ink" />
          <text x={481} y={305} className="a-klein b-inv" textAnchor="middle">Freigeben</text>
        </g>
        <g className="fx fx-pop" style={v({ '--s': 0.34, '--d': 0.012 })}>
          <rect x={422} y={288} width={118} height={26} rx={7} className="b-okfill" />
          <text x={481} y={305} className="a-klein b-inv" textAnchor="middle">✓ an alle 4</text>
        </g>
        <g className="fx fx-flug" style={v({ '--s': 0.3, '--d': 0.035, '--s2': 0.355, '--d2': 0.012, '--fx': -90, '--fy': 50 })}>
          <path d="M 478 300 l 0 17 l 4.5 -4 l 3 7 l 3 -1.4 l -3 -6.8 l 6 -.3 z" className="a-maus" />
        </g>
      </g>
      <g className="fx fx-in" style={v({ '--s': 0.53, '--d': 0.02, '--s2': 0.58, '--d2': 0.02 })}>
        <text x={184} y={156} className="a-klein">4 Angebote eingegangen · fristgerecht</text>
      </g>

      {/* Positionen kommen aus dem LV */}
      {SPIEGEL.map(([oz, t], r) => (
        <g key={oz} className="fx fx-flug" style={v({ '--s': 0.6 + r * 0.01, '--d': 0.04, '--fx': -16, '--fy': -18 })}>
          <text x={0} y={ZY(r) + 19} className="a-mono a-dim">{oz}</text>
          <text x={46} y={ZY(r) + 19} className="a-txt">{t}</text>
        </g>
      ))}
      {/* Zellen füllen sich, während das Angebot durch die Spalte läuft */}
      {SPIEGEL.map(([oz, , z], r) => (
        <g key={oz}>
          {z.map(([val, k], b) => {
            const s = s3(b) + 0.08 * ((ZY(r) + 15 - yOben) / (yUnten - yOben)) - 0.004;
            const ring = k && k !== 'best' ? 0.85 + n++ * 0.01 : 0;
            return (
              <g key={b}>
                <g className="fx fx-pop" style={v({ '--s': s, '--d': 0.015 })}>
                  <rect x={COLX[b]} y={ZY(r)} width={CW} height={30} rx={6} className={cls[k]} />
                  <text x={COLX[b] + CW / 2} y={ZY(r) + 19} className={tcls[k]} textAnchor="middle" style={k === 'aus' ? { fontSize: 10.5 } : undefined}>{val}</text>
                </g>
                {k === 'best' && (
                  <g className="fx fx-fade" style={v({ '--s': 0.82, '--d': 0.025 })}>
                    <rect x={COLX[b]} y={ZY(r)} width={CW} height={30} rx={6} className="b-best" />
                    <text x={COLX[b] + CW / 2} y={ZY(r) + 19} className="a-mono a-b a-okt" textAnchor="middle">{val}</text>
                  </g>
                )}
                {ring > 0 && <rect x={COLX[b] - 3} y={ZY(r) - 3} width={CW + 6} height={36} rx={8} className={`fx fx-pop a-ring a-ring-${k}`} style={v({ '--s': ring, '--d': 0.015 })} />}
              </g>
            );
          })}
        </g>
      ))}
      {/* Angebote: Bieter → Postfach → Spaltenkopf → durch die Spalte */}
      {BIETER.map((b, i) => (
        <g key={b} className="fx fx-zug" style={v({ '--s': s3(i), '--d': 0.08, '--fx': 0, '--fy': yOben - yUnten })}>
          <g className="fx fx-zug" style={v({ '--s': s2(i), '--d': 0.04, '--fx': slotX(i) - mitte(i), '--fy': slotY - yOben })}>
            <g className="fx fx-flug" style={v({ '--s': s1(i), '--d': 0.04, '--s2': s3(i) + 0.08, '--d2': 0.012, '--fx': mitte(i) - slotX(i), '--fy': 18 - slotY })}>
              <rect x={mitte(i) - 25} y={yUnten - 11} width={50} height={22} rx={6} className="b-ink" />
              <text x={mitte(i)} y={yUnten + 4} className="a-klein a-b b-inv" textAnchor="middle">{FORMAT[i]}</text>
            </g>
          </g>
        </g>
      ))}
      {leg.map((l, i) => (
        <g key={l.t} className="fx fx-in" style={v({ '--s': 0.89 + i * 0.01, '--d': 0.015 })}>
          <rect x={l.x} y={l.y} width={12} height={12} rx={3} className={`a-leg-${l.k}`} />
          <text x={l.x + 18} y={l.y + 11} className="a-txt">{l.t}</text>
        </g>
      ))}
    </g>
  );
}

function PaketKarte() {
  const [n, lv, anzahl] = GEWERKE[TB];
  return (
    <g>
      <rect x={0} y={0} width={150} height={56} rx={12} className="b-ink" />
      <text x={16} y={25} className="a-txt a-b b-inv">{n}</text>
      <text x={16} y={43} className="a-klein b-inv2">{`${lv} · ${anzahl} Pos.`}</text>
    </g>
  );
}

function Buehne({ L }: { L: Layout }) {
  const P = (u: number, q: number, z = 0): Pt => [L.ox + (u - q) * L.k * 0.866, L.oy + (u + q) * L.k * 0.5 - z];
  const hWand = L.k * 1.9, hAussen = L.k * 0.42;
  const [cx, cy] = L.zentrum;
  const verschoben = ([x, y]: Pt): Pt => [cx + (x - cx) * L.move.s + L.move.dx, cy + (y - cy) * L.move.s + L.move.dy];
  const chipW = (n: string) => Math.round(n.length * L.chipF + 28);

  const gruppen = (Object.keys(L.gruppen) as Gruppe[]).map((g, gi) => {
    const G = L.gruppen[g];
    const chips = G.items.map((n, i) => {
      const col = G.cols > 1 ? i % G.cols : 0, row = G.cols > 1 ? Math.floor(i / G.cols) : i;
      return { n, x: G.x + col * G.colW, y: G.y + 14 + row * L.chipGap, w: chipW(n), s: -0.24 + gi * 0.05 + i * 0.012 };
    });
    const fl = bez(G.anker, [G.anker[0] + (cx - G.anker[0]) * 0.5, G.anker[1]], [cx + (G.anker[0] - cx) * 0.25, cy + (G.anker[1] - cy) * 0.5], [cx, cy - 20]);
    return { g, G, chips, fl, s: 0.0 + gi * 0.025 };
  });
  const teile = WAENDE.flatMap((w, i) => prismen(P, w, w[4] === 'vorne' ? hAussen : hWand).map((p) => ({ ...p, aussen: w[4] !== 'innen', s: w[4] === 'innen' ? 0.1 + i * 0.014 : 0.08 }))).sort((a, b) => a.d - b.d);
  // Fenster auf der Innenseite der hinteren Wände, Dach als Satteldach mit First in Längsrichtung (v = 3)
  const fenster = FENSTER.map(({ wand, a, b }) => {
    const z1 = hWand * 0.34, z2 = hWand * 0.8, o = 0.09;
    const q = wand === 'v0' ? [P(a, o, z1), P(b, o, z1), P(b, o, z2), P(a, o, z2)] : [P(o, a, z1), P(o, b, z1), P(o, b, z2), P(o, a, z2)];
    return pts(q);
  });
  const rh = L.k * 2.7, ue = 0.35; // Firsthöhe über Traufe, Dachüberstand
  const traufe = hWand - ue * (rh / 3);
  const dachHinten = pts([P(-ue, -ue, traufe), P(10 + ue, -ue, traufe), P(10 + ue, 3, hWand + rh), P(-ue, 3, hWand + rh)]);
  const dachVorne = pts([P(-ue, 3, hWand + rh), P(10 + ue, 3, hWand + rh), P(10 + ue, 6 + ue, traufe), P(-ue, 6 + ue, traufe)]);
  const giebel = pts([P(0, 0, hWand), P(0, 3, hWand + rh), P(0, 6, hWand)]);
  const giebelVorne = pts([P(10, 0, hWand), P(10, 3, hWand + rh), P(10, 6, hWand)]);
  const umriss = [P(0, 0), P(10, 0), P(10, 6), P(0, 6)];
  const umrissL = Math.round(2 * (10 + 6) * L.k);
  const R = L.rows, S = sortiert(R.step, R.kopf);

  const cap: [string, string, number, number | null][] = [
    ['Ihre Daten. Aus jedem Programm.', 'CAD und BIM, alte LVs, Fachplaner, Ihr Regelwerk.', 0, 0.04],
    ['plua ai liest alles.', 'Und verknüpft es: Bauteile, Mengen, Texte, Vorgaben.', 0.05, 0.3],
    ['Daraus: jede Position.', 'Mit Menge, Langtext und Herkunft, gezogen aus allen Unterlagen.', 0.33, 0.72],
    ['Sortiert nach Gewerken.', 'Fachlose nach § 5 VOB/A, nummeriert nach Ihrem Schema.', 0.74, 0.92],
    ['Das LV steht.', 'Geprüft gegen VOB/C, VOB/A und Ihr Regelwerk.', 0.94, 2],
  ];

  return (
    <svg className={`fluss-svg ${L.name}`} viewBox={`0 0 ${L.W} ${L.H}`} preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="Daten aus CAD und BIM, alten LVs, Fachplanern und dem Regelwerk fließen ins Modell, daraus entstehen die Positionen, sortiert nach Gewerken und nummeriert. Das Trockenbau-LV geht an die Bieter: Versand Versand an die Bieter, Rückfragen mit Freigabe und die Angebote im Preisspiegel.">
      <g className="fx-aus" style={v({ '--p': 'calc(var(--P, 0) / 0.33)', '--a': 0.41, '--ad': 0.015 })}>
      {/* Kapiteltexte */}
      {cap.map(([t, s2, a, b], i) => (
        <g key={t} className="fx fx-cap" style={v({ '--s': i === 0 ? -1 : a, '--d': 0.04, ...(b !== null ? { '--s2': b, '--d2': 0.04 } : {}) })}>
          <text x={L.cap[0]} y={L.cap[1] - (L.name === 'quer' ? 20 : 14)} className="f-kap">{`0${i + 1} / ${KAPITEL}`}</text>
          <text x={L.cap[0]} y={L.cap[1] + (L.name === 'quer' ? 12 : 8)} className="f-cap">{t}</text>
          <text x={L.cap[0]} y={L.cap[1] + (L.name === 'quer' ? 40 : 28)} className="f-sub">{s2}</text>
        </g>
      ))}

      {/* Datenflüsse */}
      {gruppen.map(({ g, fl, s }) => (
        <g key={g}>
          <path d={fl.d} className="fx fx-draw f-fluss" style={v({ '--s': s, '--d': 0.07, '--L': fl.L, '--s2': 0.3, '--d2': 0.05, '--dim': 1 })} />
          <path d={fl.d} className="fx fx-paket" style={v({ '--s': s, '--d': 0.03, '--s2': 0.27, '--d2': 0.04, stroke: FARBE[g] })} />
        </g>
      ))}

      {/* Quellen */}
      {gruppen.map(({ g, G, chips }, gi) => {
        const zeilen = G.cols > 1 ? Math.ceil(G.items.length / G.cols) : G.items.length;
        const gx = G.x + (G.cols > 1 ? G.colW : 70), gy = G.y + 14 + (zeilen * L.chipGap) / 2;
        return (
        <g key={g} className="fx fx-sog" style={v({ '--s': 0.255 + gi * 0.008, '--d': 0.05, '--fx': cx - gx, '--fy': cy - 20 - gy })}>
        <g className="fx fx-quelle" style={v({ '--s': -0.25 + gi * 0.05, '--d': 0.04, '--s2': 0.4, '--d2': 0.05 })}>
          <rect x={G.x} y={G.y - 12} width={8} height={8} rx={2} style={{ fill: FARBE[g] }} />
          <text x={G.x + 14} y={G.y - 4} className="f-gruppe">{TITEL[g]}</text>
          {chips.map((c) => (
            <g key={c.n} className="fx fx-in" style={v({ '--s': c.s, '--d': 0.04 })}>
              <rect x={c.x} y={c.y} width={c.w} height={L.chipH} rx={7} className="f-chip" />
              <circle cx={c.x + 12} cy={c.y + L.chipH / 2} r={3.6} style={{ fill: FARBE[g] }} />
              <text x={c.x + 22} y={c.y + L.chipH / 2 + 4.5} className="f-chiptext">{c.n}</text>
            </g>
          ))}
        </g>
        </g>
        );
      })}

      {/* Nach dem Einziehen: alles in einem Datenbestand verknüpft */}
      {(() => {
        const q = L.name === 'quer', t = 'Alle Unterlagen verknüpft', w = Math.round(t.length * (q ? 7.4 : 6.2) + (q ? 86 : 70)), h = q ? 28 : 20;
        const [mx, my] = verschoben([cx, cy]), x0 = mx - w / 2, y0 = q ? 590 : 236;
        return (
          <g className="fx fx-pop" style={v({ '--s': 0.33, '--d': 0.04, '--s2': 0.72, '--d2': 0.03 })}>
            <rect x={x0} y={y0} width={w} height={h} rx={h / 2} className="f-chip" />
            {(['cad', 'alt', 'fach', 'regel'] as Gruppe[]).map((g, k) => <circle key={g} cx={x0 + (q ? 16 : 12) + k * (q ? 11 : 9)} cy={y0 + h / 2} r={q ? 3.6 : 2.8} style={{ fill: FARBE[g] }} />)}
            <text x={x0 + (q ? 64 : 52)} y={y0 + h / 2 + (q ? 4.5 : 3.5)} className="f-chiptext">{t}</text>
          </g>
        );
      })()}

      <g className="fx fx-fade" style={v({ '--s': -9, '--d': 0.01, '--s2': 1.04, '--d2': 0.04 })}>
      {/* Modell, rückt in Takt 3 zur Seite */}
      <g className="fx fx-move" style={v({ '--s': 0.31, '--d': 0.08, '--mx': L.move.dx, '--my': L.move.dy, '--ms': L.move.s, transformOrigin: `${cx}px ${cy}px` })}>
        <polygon points={pts(umriss)} className="fx fx-draw f-umriss" style={v({ '--s': -0.1, '--d': 0.08, '--L': umrissL })} />
        {teile.map((p, i) => (
          <g key={i} className="fx fx-grow" style={v({ '--s': p.s, '--d': 0.05 })}>
            <polygon points={p.f} className={p.aussen ? 'a-g2' : 'a-w2'} />
            <polygon points={p.e} className={p.aussen ? 'a-g3' : 'a-w3'} />
            <polygon points={p.t} className={p.aussen ? 'a-g1' : 'a-w1'} />
          </g>
        ))}
        {fenster.map((f, i) => <polygon key={i} points={f} className="fx fx-fade f-fenster" style={v({ '--s': 0.15 + i * 0.008, '--d': 0.04 })} />)}
        {/* Satteldach: hinten als Fläche, vorne nur als Kante, damit man ins Haus sieht */}
        <g className="fx fx-fade" style={v({ '--s': 0.17, '--d': 0.05 })}>
          <polygon points={giebel} className="f-giebel" />
          <polygon points={dachHinten} className="f-dach" />
        </g>
        <polygon points={dachVorne} className="fx fx-fade f-dachkante" style={v({ '--s': 0.19, '--d': 0.05 })} />
        <polygon points={giebelVorne} className="fx fx-fade f-dachkante" style={v({ '--s': 0.21, '--d': 0.04 })} />
        {/* Bauteile außen hervorheben, solange die Mengen-Schilder stehen */}
        <polygon points={dachHinten} className="fx fx-fade f-hl-dach" style={v({ '--s': 0.2, '--d': 0.03, '--s2': 0.29, '--d2': 0.04 })} />
        {fenster.map((f, i) => <polygon key={`h${i}`} points={f} className="fx fx-fade f-hl-fenster" style={v({ '--s': 0.22 + i * 0.006, '--d': 0.02, '--s2': 0.29, '--d2': 0.04 })} />)}
        <path d={`M ${P(-ue, 3, hWand + rh).join(' ')} L ${P(10 + ue, 3, hWand + rh).join(' ')}`} className="fx fx-fade f-first" style={v({ '--s': 0.17, '--d': 0.05 })} />
      </g>
      {L.tags.map(([t, x, y], i) => (
        <g key={t} className="fx fx-pop" style={v({ '--s': 0.2 + i * 0.02, '--d': 0.03, '--s2': 0.3, '--d2': 0.04 })}>
          <rect x={x} y={y} width={t.length * (L.name === 'quer' ? 8.2 : 6.8) + 20} height={L.chipH} rx={7} className="f-chip" />
          <text x={x + 10} y={y + L.chipH / 2 + 4.5} className="f-tag">{t}</text>
        </g>
      ))}

      {/* Bezüge ins Modell */}
      {ZEILEN.map(([oz, , , , , b], i) => {
        const y = R.y0 + i * R.step, s = 0.4 + i * 0.026;
        const ziel = b ? verschoben(P(b[0], b[1], b[2] * hWand)) : null;
        const linie = ziel && L.name === 'quer' ? bez(ziel, [ziel[0] + 60, ziel[1]], [R.x - 40, y + (R.step - 8) / 2], [R.x - 2, y + (R.step - 8) / 2]) : null; // im Hochformat nur die Punkte am Modell
        return (
          <g key={i}>
            {linie && <path d={linie.d} className="fx fx-draw f-bezug" style={v({ '--s': s - 0.01, '--d': 0.03, '--L': linie.L, '--s2': 0.71, '--d2': 0.03, '--dim': 1 })} />}
            {ziel && <circle cx={ziel[0]} cy={ziel[1]} r={2.8} className="fx fx-pop f-punkt" style={v({ '--s': s - 0.01, '--d': 0.02 })} />}
          </g>
        );
      })}
      <g className="fx fx-in" style={v({ '--s': 0.95, '--d': 0.03 })}>
        <text x={L.summe[0]} y={L.summe[1]} className="f-summe">Σ 5 Gewerke · 166 Positionen</text>
      </g>
      {L.badges && ['VOB/C', 'VOB/A', 'Regelwerk', '5 Lücken geschlossen'].map((t, i) => {
        const x = L.summe[0] + [0, 92, 184, 300][i];
        return (
          <g key={t} className="fx fx-pop" style={v({ '--s': 0.97 + i * 0.015, '--d': 0.03 })}>
            <rect x={x} y={L.summe[1] + 18} width={t.length * 7.4 + 34} height={28} rx={14} className="f-okbg" />
            <text x={x + 14} y={L.summe[1] + 36} className="f-okt">✓ {t}</text>
          </g>
        );
      })}
      {!L.badges && (
        <g className="fx fx-in" style={v({ '--s': 0.97, '--d': 0.03 })}>
          <text x={L.summe[0]} y={L.summe[1] + 20} className="f-okt">✓ VOB/C · VOB/A · Regelwerk geprüft</text>
        </g>
      )}
      </g>

      {/* Positionen: erst in Erkennungsreihenfolge, dann nach Gewerken sortiert und nummeriert */}
      {GEWERKE.map(([n, lv, anzahl, f], g) => (
        <g key={n} className="fx fx-in" style={v({ '--s': 0.78 + g * 0.02, '--d': 0.04, '--s2': 1.04, '--d2': 0.04 })}>
          <rect x={R.x + 2} y={R.y0 + S.koepfe[g] + R.kopf / 2 - 6} width={8} height={8} rx={2} style={{ fill: f }} />
          <text x={R.x + 16} y={R.y0 + S.koepfe[g] + R.kopf / 2 + 2} className="f-gruppe">{`${n.toUpperCase()} · ${lv} · ${anzahl} POS.`}</text>
        </g>
      ))}
      {ZEILEN.map(([oz, t, m, , , , gw], i) => {
        const ya = R.y0 + i * R.step, y = R.y0 + S.zeile[i], s = 0.4 + i * 0.026, hz = (R.step - 8) / 2;
        const [tx, ty, sc] = L.box, zx = tx + 75 * sc, zy = ty + 28 * sc;
        const zeile = (
          <g className="fx fx-zug" style={v({ '--s': 0.74 + i * 0.006, '--d': 0.07, '--fx': 0, '--fy': ya - y })}>
            <g className="fx fx-row" style={v({ '--s': s, '--d': 0.03 })}>
              <rect x={R.x} y={y} width={R.w} height={R.step - 8} rx={7} className="f-zeile" />
              <g className="fx fx-in" style={v({ '--s': 0.86 + S.zeile[i] / 4000, '--d': 0.025 })}><text x={R.x + R.oz} y={y + hz + 4.5} className="f-oz">{oz}</text></g>
              <text x={R.x + R.txt} y={y + hz + 4.5} className="f-text">{t}</text>
              <text x={R.x + R.menge} y={y + hz + 4.5} className="f-menge" textAnchor="end">{m}</text>
            </g>
          </g>
        );
        return gw === TB
          ? <g key={i} className="fx fx-sog" style={v({ '--s': 1.06 + S.zeile[i] / 8000, '--d': 0.06, '--fx': zx - (R.x + R.w / 2), '--fy': zy - (y + hz) })}>{zeile}</g>
          : <g key={i} className="fx fx-fade" style={v({ '--s': -9, '--d': 0.01, '--s2': 1.04, '--d2': 0.04 })}>{zeile}</g>;
      })}
      </g>

      {/* Das Trockenbau-LV sammelt seine Positionen ein und wird zur Karte der Vergabe */}
      <g transform={`translate(${L.box[0]} ${L.box[1]}) scale(${L.box[2]})`} style={v({ '--p': 'calc(var(--P, 0) / 0.33)' })}>
        <g className="fx fx-pop" style={v({ '--s': 1.05, '--d': 0.04, '--s2': 1.37, '--d2': 0.02 })}><PaketKarte /></g>
      </g>
      <Takt L={L} nr={6} start={0.425} dauer={0.54} ende caps={KAP_VERGABE}><TaktVergabe /></Takt>
    </svg>
  );
}

export default function Fluss() {
  return (
    <div className="fluss-buehne">
      <Buehne L={QUER} />
      <Buehne L={HOCH} />
      <p className="fluss-hinweis" aria-hidden="true">Scrollen</p>
    </div>
  );
}
