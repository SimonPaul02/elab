// Sechs Animationen für den Ablauf „Vom Plan zum Preisspiegel“. Reines SVG und CSS, kein JavaScript im Browser:
// Jede Animation hat eine eigene Zeitleiste (Tl). Alle Elemente laufen mit derselben Dauer, die Abfolge steckt in
// den Prozentwerten der Keyframes. Der Grundzustand jedes Elements ist der Endzustand, so zeigt die Seite bei
// „Bewegung reduzieren“ das fertige Bild.

import type { ReactNode } from 'react';

type St = [number, string][];
const E = 'cubic-bezier(.45,0,.2,1)';

class Tl {
  rules: string[] = [];
  n = 0;
  constructor(public id: string, public T = 9) {}
  a(steps: St, extra = ''): string {
    const c = `${this.id}-${this.n++}`;
    this.rules.push(`@keyframes ${c}{${steps.map(([p, s]) => `${p}%{${s}}`).join('')}}.${c}{${extra}animation:${c} ${this.T}s ${E} infinite;}`);
    return c;
  }
  /** erscheint bei p (Prozent der Zeitleiste) aus `from` und bleibt bis zum Ende */
  show(p: number, from = 'transform:translateY(10px)', d = 5) {
    return this.a([[0, `opacity:0;${from}`], [p, `opacity:0;${from}`], [p + d, 'opacity:1;transform:none'], [100, 'opacity:1;transform:none']]);
  }
  /** nur zwischen p und q sichtbar (Grundzustand unsichtbar) */
  flash(p: number, q: number, from = 'transform:translateY(6px)') {
    return this.a([[0, `opacity:0;${from}`], [p, `opacity:0;${from}`], [p + 3, 'opacity:1;transform:none'], [q, 'opacity:1;transform:none'], [q + 3, 'opacity:0'], [100, 'opacity:0']], 'opacity:0;');
  }
  /** Linie zeichnen */
  draw(p: number, len: number, d = 8) {
    return this.a([[0, `stroke-dashoffset:${len}`], [p, `stroke-dashoffset:${len}`], [p + d, 'stroke-dashoffset:0'], [100, 'stroke-dashoffset:0']], `stroke-dasharray:${len};`);
  }
  /** Füllfarbe wechseln bei p */
  fill(p: number, from: string, to: string, d = 4) {
    return this.a([[0, `fill:${from}`], [p, `fill:${from}`], [p + d, `fill:${to}`], [100, `fill:${to}`]], `fill:${to};`);
  }
  stroke(p: number, from: string, to: string, d = 4) {
    return this.a([[0, `stroke:${from}`], [p, `stroke:${from}`], [p + d, `stroke:${to}`], [100, `stroke:${to}`]], `stroke:${to};`);
  }
  root() {
    return this.a([[0, 'opacity:0'], [3, 'opacity:1'], [93, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]);
  }
  css() { return this.rules.join(''); }
}

function Buehne({ tl, label, children, w = 480, h = 320 }: { tl: Tl; label: string; children: ReactNode; w?: number; h?: number }) {
  return (
    <div className={`anim${w > 480 ? ' breit' : ''}`} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        <style dangerouslySetInnerHTML={{ __html: tl.css() }} />
        {children}
      </svg>
    </div>
  );
}


// ---------- Werkzeug-Chips (Namen der Integrationen, neutrale Farbpunkte je Kategorie) ----------
const TINT = { bim: 'var(--t-blue)', ava: 'var(--t-orange)', vergabe: 'var(--t-purple)', ablage: 'var(--t-teal)', projekt: 'var(--t-rose)', format: 'var(--t-green)' } as const;
type Kat = keyof typeof TINT;
const breite = (n: string) => Math.round(n.length * 6.5 + 26);
function reihe(namen: string[], x0: number, gap = 6) { let x = x0; return namen.map((n) => { const r = { n, x, w: breite(n) }; x += r.w + gap; return r; }); }
function Werkzeug({ n, x, y, w, k, cls }: { n: string; x: number; y: number; w: number; k: Kat; cls: string }) {
  return (
    <g className={cls}>
      <rect x={x} y={y} width={w} height={22} rx={6} className="a-chip" />
      <circle cx={x + 11} cy={y + 11} r={3.5} style={{ fill: TINT[k] }} />
      <text x={x + 19} y={y + 15} className="a-tool">{n}</text>
    </g>
  );
}

// ---------- Isometrie für das Gebäudemodell ----------
type Wand = [number, number, number, number, boolean]; // u1, v1, u2, v2, außen
const WAENDE: Wand[] = [
  [0, 0, 10, 0, true], [10, 0, 10, 6, true], [0, 6, 10, 6, true], [0, 0, 0, 6, true],
  [4, 0, 4, 6, false], [4, 3, 10, 3, false], [7, 0, 7, 3, false], [8.5, 3, 8.5, 6, false],
];
function iso(ox: number, oy: number, k: number) {
  return (u: number, v: number, z = 0): [number, number] => [ox + (u - v) * k * 0.866, oy + (u + v) * k * 0.5 - z];
}
const pts = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** Wand als Prisma: sichtbare Front, Stirnseite und Oberseite, in Stücke geteilt für die Tiefensortierung */
function prismen(P: ReturnType<typeof iso>, w: Wand, h: number, t = 0.16) {
  const [u1, v1, u2, v2] = w, horiz = v1 === v2, L = horiz ? u2 - u1 : v2 - v1, n = Math.max(1, Math.ceil(L / 2));
  const out: { d: number; front: string; ende: string; top: string }[] = [];
  for (let i = 0; i < n; i++) {
    const a = i / n, b = (i + 1) / n;
    if (horiz) {
      const ua = u1 + L * a, ub = u1 + L * b, v = v1;
      out.push({ d: (ua + ub) / 2 + v, front: pts([P(ua, v + t / 2), P(ub, v + t / 2), P(ub, v + t / 2, h), P(ua, v + t / 2, h)]), ende: pts([P(ub, v - t / 2), P(ub, v + t / 2), P(ub, v + t / 2, h), P(ub, v - t / 2, h)]), top: pts([P(ua, v - t / 2, h), P(ub, v - t / 2, h), P(ub, v + t / 2, h), P(ua, v + t / 2, h)]) });
    } else {
      const va = v1 + L * a, vb = v1 + L * b, u = u1;
      out.push({ d: u + (va + vb) / 2, front: pts([P(u + t / 2, va), P(u + t / 2, vb), P(u + t / 2, vb, h), P(u + t / 2, va, h)]), ende: pts([P(u - t / 2, vb), P(u + t / 2, vb), P(u + t / 2, vb, h), P(u - t / 2, vb, h)]), top: pts([P(u - t / 2, va, h), P(u + t / 2, va, h), P(u + t / 2, vb, h), P(u - t / 2, vb, h)]) });
    }
  }
  return out;
}

// ---------- 1 Erkennen und erstellen (breit) ----------
// Links die Quellen (CAD/BIM, alte LVs, Fachplaner-LVs), in der Mitte das Modell mit Mengen, rechts das entstehende LV.
const bez = (p0: number[], p1: number[], p2: number[], p3: number[]) => {
  let L = 0, prev = p0;
  for (let i = 1; i <= 40; i++) {
    const t = i / 40, m = 1 - t;
    const q = [0, 1].map((k) => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]);
    L += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q;
  }
  return { d: `M ${p0} C ${p1} ${p2} ${p3}`.replace(/,/g, ' '), len: Math.ceil(L) };
};
export function AnimErkennen() {
  const tl = new Tl('ae', 10);
  const r = tl.root();
  // Quellen
  const cad = [reihe(['Revit', 'Archicad'], 20), reihe(['Allplan', 'Vectorworks'], 20), reihe(['IFC · DWG · PDF'], 20)];
  const cadC = cad.map((row, ri) => row.map((q, i) => ({ ...q, y: 44 + ri * 28, c: tl.show(2 + ri * 3 + i * 1.5, 'transform:translateX(-10px)', 4) }))).flat();
  const alt = reihe(['ORCA AVA', 'California.pro'], 20).map((q, i) => ({ ...q, y: 162, c: tl.show(6 + i * 2, 'transform:translateX(-10px)', 4) }));
  const fach = [{ ...reihe(['Elektro · LV 053'], 20)[0], y: 222 }, { ...reihe(['Blitzschutz · LV 050'], 20)[0], y: 250 }].map((q, i) => ({ ...q, c: tl.show(9 + i * 2, 'transform:translateX(-10px)', 4) }));
  // Wege mit Datenpaketen
  const weg = (p: ReturnType<typeof bez>, t0: number, t1: number, farbe: string) => ({
    ...p,
    linie: tl.draw(t0 - 4, p.len, 4),
    paket: tl.a([[0, 'stroke-dashoffset:14;opacity:0'], [t0, 'stroke-dashoffset:14;opacity:0'], [t0 + 1, 'stroke-dashoffset:14;opacity:1'], [t1, `stroke-dashoffset:${-p.len};opacity:1`], [t1 + 1, `stroke-dashoffset:${-p.len};opacity:0`], [100, 'opacity:0']], `stroke-dasharray:14 ${p.len + 40};opacity:0;`),
    farbe,
  });
  const ende = (q: { x: number; w: number; y: number }) => [q.x + q.w + 4, q.y + 11];
  const wCad = [weg(bez(ende(cadC[3]), [300, 83], [300, 140], [380, 160]), 12, 22, 'var(--t-blue)'), weg(bez(ende(cadC[4]), [280, 111], [300, 160], [380, 170]), 14, 24, 'var(--t-blue)')];
  const wModell = weg(bez([560, 150], [600, 150], [600, 99], [636, 99]), 40, 48, 'var(--t-blue)');
  const wAlt = weg(bez(ende(alt[1]), [360, 150], [520, 20], [636, 61]), 54, 64, 'var(--t-orange)');
  const wFach = weg(bez(ende(fach[0]), [320, 300], [560, 306], [636, 213]), 66, 76, 'var(--t-teal)');
  // Modell
  const k = 15, P = iso(394, 112, k);
  const umriss = tl.draw(14, 500, 8);
  const steigen = WAENDE.map((w, i) => tl.show(20 + (w[4] ? 0 : 3 + i * 1.6), 'transform:scaleY(0)', 5));
  const teile = WAENDE.flatMap((w, i) => prismen(P, w, w[4] ? 10 : 30).map((p) => ({ ...p, aussen: w[4], c: steigen[i] }))).sort((x, y) => x.d - y.d);
  const ecken = [P(0, 0), P(10, 0), P(10, 6), P(0, 6)];
  const mengen = [['W1 · 412,5 m²', 292, 66, 30], ['34 Türen', 500, 92, 34], ['D1 · 520 m²', 330, 258, 38]] as const;
  const mengenC = mengen.map(([, , , p]) => tl.show(p, 'transform:scale(.7)', 4));
  // LV
  const rows = [
    ['01.01', 'Baustelleneinrichtung', '1 psch', 'Büro-LV', 'var(--t-orange)', 62],
    ['02.01', 'Ständerwand W1', '412,5 m²', 'Modell', 'var(--t-blue)', 44],
    ['02.05', 'Türöffnung', '34 St', 'Modell', 'var(--t-blue)', 47],
    ['03.01', 'Akustikdecke D1', '520 m²', 'Modell', 'var(--t-blue)', 50],
    ['04.01', 'Hohlwanddosen', '71 St', 'Elektro-LV', 'var(--t-teal)', 74],
    ['04.02', 'Abschottung EI 30', '22 St', 'Elektro-LV', 'var(--t-teal)', 78],
  ] as const;
  const rowC = rows.map((row) => tl.show(row[5], 'transform:translateX(14px)', 4));
  const fertig = tl.show(84);
  return (
    <Buehne tl={tl} w={960} h={320} label="Alle Unterlagen aus allen Programmen werden erkannt, Mengen aus dem Modell, daraus das LV mit alten LVs und Fachplaner-LVs">
      <g className={r}>
        <text x={20} y={34} className="a-mono a-dim">CAD UND BIM</text>
        <text x={20} y={152} className="a-mono a-dim">ALTE LVS</text>
        <text x={20} y={212} className="a-mono a-dim">FACHPLANER</text>
        <text x={300} y={34} className="a-mono a-dim">MENGEN AUS DEM MODELL</text>
        <text x={640} y={34} className="a-mono a-dim">LV 039 · ENTSTEHT</text>
        {[...wCad, wModell, wAlt, wFach].map((w, i) => (
          <g key={i}><path d={w.d} className={`a-fluss ${w.linie}`} /><path d={w.d} className={`a-paket ${w.paket}`} style={{ stroke: w.farbe }} /></g>
        ))}
        {cadC.map((q, i) => <Werkzeug key={q.n} n={q.n} x={q.x} y={q.y} w={q.w} k={i < 4 ? 'bim' : 'format'} cls={q.c} />)}
        {alt.map((q) => <Werkzeug key={q.n} n={q.n} x={q.x} y={q.y} w={q.w} k="ava" cls={q.c} />)}
        {fach.map((q) => <Werkzeug key={q.n} n={q.n} x={q.x} y={q.y} w={q.w} k="ablage" cls={q.c} />)}
        <polygon points={pts(ecken)} className={`a-umriss ${umriss}`} />
        {teile.map((p, i) => (
          <g key={i} className={p.c} style={{ transformOrigin: '50% 100%' }}>
            <polygon points={p.front} className={p.aussen ? 'a-g2' : 'a-w2'} />
            <polygon points={p.ende} className={p.aussen ? 'a-g3' : 'a-w3'} />
            <polygon points={p.top} className={p.aussen ? 'a-g1' : 'a-w1'} />
          </g>
        ))}
        {mengen.map(([t, x, y], i) => (
          <g key={t} className={mengenC[i]}><rect x={x} y={y} width={t.length * 7 + 18} height={22} rx={6} className="a-chip" /><text x={x + 9} y={y + 15} className="a-mono">{t}</text></g>
        ))}
        {rows.map(([oz, t, m, h, c], i) => {
          const y = 46 + i * 38;
          return (
            <g key={oz} className={rowC[i]}>
              <rect x={640} y={y} width={312} height={30} rx={6} className="a-card" />
              <text x={650} y={y + 19} className="a-mono a-dim">{oz}</text>
              <text x={688} y={y + 19} className="a-txt">{t}</text>
              <text x={872} y={y + 19} className="a-mono" textAnchor="end">{m}</text>
              <circle cx={884} cy={y + 15} r={3.5} style={{ fill: c }} />
              <text x={892} y={y + 19} className="a-klein">{h}</text>
            </g>
          );
        })}
        <g className={fertig}><text x={640} y={300} className="a-txt a-b"><tspan className="a-ok">✓</tspan> 19 Positionen, jede mit Herkunft</text></g>
      </g>
    </Buehne>
  );
}

// ---------- 3 LV aus Ihrem Regelwerk, geprüft ----------
export function AnimLV() {
  const tl = new Tl('al');
  const r = tl.root();
  const regeln = ['Q3 Aufenthaltsräume', 'Keine Produktnamen', 'Stundenlohn ≤ 2 %'];
  const rY = [62, 108, 154];
  const an = [32, 24, 44]; // wann die Regel greift
  const regelBg = an.map((p) => tl.a([[0, 'fill:var(--sheet);stroke:var(--rule)'], [p, 'fill:var(--sheet);stroke:var(--rule)'], [p + 3, 'fill:var(--accent-soft);stroke:var(--accent)'], [p + 14, 'fill:var(--accent-soft);stroke:var(--accent)'], [p + 18, 'fill:var(--sheet);stroke:var(--rule)'], [100, 'fill:var(--sheet);stroke:var(--rule)']]));
  const zeilen = [['02.01', 'Ständerwand W1', '412,5 m²', 8], ['02.02', 'Flurwand EI 30', '186,2 m²', 14], ['03.01', 'Akustikdecke D1', '520 m²', 20], ['04.04', 'Oberfläche Q3', '640 m²', 30], ['05.01', 'Stundenlohn', '32 h', 42]]
    .map(([oz, t, m, p], i) => ({ oz, t, m, y: 56 + i * 32, c: tl.show(p as number, 'transform:translateX(14px)') }));
  // Verbinder Regel → Zeile
  const verb = [[0, 3, 32], [1, 2, 24], [2, 4, 44]].map(([ri, zi, p]) => ({ d: `M 168 ${rY[ri] + 18} C 186 ${rY[ri] + 18}, 176 ${zeilen[zi].y + 15}, 196 ${zeilen[zi].y + 15}`, c: tl.flash(p, p + 14, '') }));
  const alt = tl.flash(44, 52, '');
  const neu = tl.show(55, 'transform:none', 3);
  const badges = [['VOB/C', 60], ['VOB/A', 64], ['Regelwerk', 68], ['5 Lücken zu', 72]].map(([t, p], i) => ({ t: t as string, x: 196 + [0, 56, 112, 186][i], w: [50, 50, 68, 82][i], c: tl.show(p as number, 'transform:scale(.6)', 4) }));
  const export_ = reihe(['ORCA AVA', 'California.pro', 'GAEB'], 196).map((r, i) => ({ ...r, c: tl.show(80 + i * 3, 'transform:translateY(6px)', 4) }));
  const pfeil = tl.show(78, 'transform:translateX(-6px)', 3);
  return (
    <Buehne tl={tl} label="Das LV entsteht nach dem Regelwerk des Büros und wird geprüft">
      <g className={r}>
        <text x={16} y={44} className="a-mono a-dim">BÜRO-REGELWERK</text>
        {regeln.map((t, i) => (<g key={t}><rect x={16} y={rY[i]} width={152} height={36} rx={8} className={regelBg[i]} /><text x={28} y={rY[i] + 22} className="a-txt"><tspan className="a-akz">§</tspan> {t}</text></g>))}
        <text x={196} y={44} className="a-mono a-dim">LV 039 · OZ · KURZTEXT · MENGE</text>
        {verb.map((v, i) => <path key={i} d={v.d} className={`a-verb ${v.c}`} />)}
        {zeilen.map((z, i) => (
          <g key={z.oz} className={z.c}>
            <rect x={196} y={z.y} width={268} height={28} rx={6} className="a-card" />
            <text x={206} y={z.y + 18} className="a-mono a-dim">{z.oz}</text>
            <text x={250} y={z.y + 18} className="a-txt">{z.t}</text>
            {i < 4 && <text x={454} y={z.y + 18} className="a-mono" textAnchor="end">{z.m}</text>}
          </g>
        ))}
        <g className={alt}><text x={454} y={zeilen[4].y + 18} className="a-mono a-alt" textAnchor="end">40 h</text></g>
        <g className={neu}><text x={454} y={zeilen[4].y + 18} className="a-mono a-akz" textAnchor="end">32 h</text></g>
        {badges.map((bd) => (<g key={bd.t} className={bd.c}><rect x={bd.x} y={226} width={bd.w} height={24} rx={12} className="a-okbg" /><text x={bd.x + bd.w / 2} y={242} className="a-klein a-okt" textAnchor="middle">✓ {bd.t}</text></g>))}
        <g className={pfeil}><text x={196} y={268} className="a-mono a-dim">ÜBERGABE AN</text></g>
        {export_.map((r, i) => <Werkzeug key={r.n} n={r.n} x={r.x} y={276} w={r.w} k={i < 2 ? 'ava' : 'format'} cls={r.c} />)}
      </g>
    </Buehne>
  );
}

// ---------- 4 Fachplaner im Takt ----------
export function AnimFachplaner() {
  const tl = new Tl('af');
  const r = tl.root();
  const knoten = [['Elektro', 'LV 053 · GAEB', 82, 64], ['Blitzschutz', 'LV 050 · PDF', 398, 64], ['TGA', 'Pläne L-201, S-201', 82, 256], ['Tragwerk', 'Positionsplan', 398, 256]] as const;
  const wege = knoten.map(([, , x, y], i) => {
    const d = `M ${x + (x < 240 ? 58 : -58)} ${y} C ${x < 240 ? 190 : 290} ${y}, ${x < 240 ? 175 : 305} 160, ${x < 240 ? 174 : 306} 160`;
    const len = 150;
    const linie = i === 0
      ? tl.a([[0, 'stroke:var(--rule)'], [56, 'stroke:var(--rule)'], [59, 'stroke:var(--fix)'], [72, 'stroke:var(--fix)'], [76, 'stroke:var(--ok)'], [100, 'stroke:var(--ok)']], 'stroke:var(--ok);')
      : tl.stroke(76, 'var(--rule)', 'var(--ok)');
    const paket = tl.a([[0, `stroke-dashoffset:12;opacity:0`], [14 + i * 3, 'stroke-dashoffset:12;opacity:0'], [15 + i * 3, 'stroke-dashoffset:12;opacity:1'], [27 + i * 3, `stroke-dashoffset:${-len};opacity:1`], [28 + i * 3, `stroke-dashoffset:${-len};opacity:0`], [34 + i * 3, 'stroke-dashoffset:12;opacity:0'], [35 + i * 3, 'stroke-dashoffset:12;opacity:1'], [47 + i * 3, `stroke-dashoffset:${-len};opacity:1`], [48 + i * 3, `stroke-dashoffset:${-len};opacity:0`], [100, 'opacity:0']], `stroke-dasharray:12 ${len + 40};opacity:0;`);
    return { d, linie, paket, k: tl.show(3 + i * 3, 'transform:scale(.8)') };
  });
  const konflikt = tl.flash(58, 71, 'transform:scale(.9)');
  const geloest = tl.show(76, 'transform:scale(.9)');
  const sync = (() => { const r = reihe(['Dalux', 'ACC', 'thinkproject', 'SharePoint'], 0); const tot = r[r.length - 1].x + r[r.length - 1].w; return r.map((q, i) => ({ ...q, x: q.x + 240 - tot / 2, c: tl.show(4 + i * 3, 'transform:translateY(6px)', 4) })); })();
  return (
    <Buehne tl={tl} label="Fachplaner liefern Pläne und LVs, die Schnittstellen werden abgeglichen">
      <g className={r}>
        {wege.map((w, i) => (<g key={i}><path d={w.d} className={`a-weg ${w.linie}`} /><path d={w.d} className={`a-paket ${w.paket}`} /></g>))}
        {knoten.map(([t, s, x, y], i) => (
          <g key={t} className={wege[i].k}>
            <rect x={x - 58} y={y - 22} width={116} height={44} rx={10} className="a-card" />
            <text x={x} y={y - 3} className="a-txt a-b" textAnchor="middle">{t}</text>
            <text x={x} y={y + 13} className="a-klein" textAnchor="middle">{s}</text>
          </g>
        ))}
        <rect x={174} y={130} width={132} height={60} rx={12} className="a-zentrum" />
        <text x={240} y={156} className="a-txt a-b a-inv" textAnchor="middle">LV 039</text>
        <text x={240} y={174} className="a-klein a-inv2" textAnchor="middle">Architekt</text>
        <g className={konflikt}><rect x={118} y={98} width={148} height={24} rx={12} className="a-fixbg" /><text x={192} y={114} className="a-klein a-fixt" textAnchor="middle">⚠ doppelt ausgeschrieben</text></g>
        <g className={geloest}><rect x={140} y={98} width={104} height={24} rx={12} className="a-okbg" /><text x={192} y={114} className="a-klein a-okt" textAnchor="middle">✓ abgestimmt</text></g>
        {sync.map((q, i) => <Werkzeug key={q.n} n={q.n} x={q.x} y={290} w={q.w} k={i < 3 ? 'projekt' : 'ablage'} cls={q.c} />)}
      </g>
    </Buehne>
  );
}

// ---------- 5 Rückfragen mit Freigabe ----------
export function AnimRueckfragen() {
  const tl = new Tl('ar', 10);
  const r = tl.root();
  const bieter = [['Meier', 'Outlook', 70], ['Huber', 'DTVP', 116], ['Schmid', 'evergabe.de', 162]] as const;
  const post = bieter.map(([n], i) => ({ y: 64 + i * 26, c: tl.show(12 + i * 7, 'transform:translateX(-8px)'), chip: tl.show(18 + i * 7, 'transform:scale(.7)', 3), n }));
  const briefe = bieter.map(([, , y], i) => tl.a([[0, 'opacity:0;transform:translate(0,0)'], [5 + i * 7, 'opacity:0;transform:translate(0,0)'], [7 + i * 7, 'opacity:1;transform:translate(0,0)'], [13 + i * 7, `opacity:1;transform:translate(70px,${post[i].y - y + 4}px)`], [15 + i * 7, `opacity:0;transform:translate(70px,${post[i].y - y + 4}px)`], [100, 'opacity:0']], 'opacity:0;'));
  const entwurf = tl.show(36, 'transform:translateY(18px)', 6);
  const balken = [0, 1, 2].map((i) => tl.show(42 + i * 3, 'transform:scaleX(0)', 4));
  const quellen = tl.show(52, 'transform:translateY(6px)', 4);
  const maus = tl.a([[0, 'opacity:0;transform:translate(-90px,40px)'], [55, 'opacity:0;transform:translate(-90px,40px)'], [57, 'opacity:1;transform:translate(-90px,40px)'], [63, 'opacity:1;transform:translate(0,0)'], [66, 'opacity:1;transform:translate(0,0) scale(.85)'], [68, 'opacity:1;transform:translate(0,0)'], [74, 'opacity:0;transform:translate(0,0)'], [100, 'opacity:0']], 'opacity:0;');
  const welle = tl.a([[0, 'opacity:0;transform:scale(.2)'], [65, 'opacity:0;transform:scale(.2)'], [66, 'opacity:.6;transform:scale(.4)'], [72, 'opacity:0;transform:scale(1.6)'], [100, 'opacity:0']], 'opacity:0;');
  const knopf = tl.fill(66, 'var(--ink)', 'var(--ok)', 2);
  const kText1 = tl.a([[0, 'opacity:1'], [66, 'opacity:1'], [67, 'opacity:0'], [100, 'opacity:0']], 'opacity:0;');
  const kText2 = tl.show(67, 'transform:none', 2);
  const avatare = [0, 1, 2, 3, 4].map((i) => { const x = 346 + i * 26; return { x, l: tl.draw(70 + i * 1.5, Math.ceil(Math.hypot(x - 400, 166 - 93)) + 2, 5), c: tl.fill(76 + i * 1.5, 'var(--sheet)', 'var(--ok)', 3) }; });
  return (
    <Buehne tl={tl} label="Rückfragen kommen an, die KI entwirft die Antwort, der Architekt gibt frei">
      <g className={r}>
        {bieter.map(([n, k, y]) => (<g key={n}><rect x={16} y={y - 16} width={104} height={32} rx={9} className="a-card" /><text x={28} y={y - 1} className="a-txt a-b">{n}</text><text x={28} y={y + 11} className="a-klein">{k}</text></g>))}
        {bieter.map(([n, , y], i) => (<g key={n} className={briefe[i]}><rect x={112} y={y - 8} width={20} height={14} rx={2} className="a-brief" /><path d={`M ${112} ${y - 8} l 10 7 l 10 -7`} className="a-brieflinie" /></g>))}
        <rect x={150} y={36} width={170} height={110} rx={10} className="a-card" />
        <text x={162} y={54} className="a-mono a-dim">POSTFACH</text>
        {post.map((p, i) => (<g key={i}><g className={p.c}><text x={162} y={p.y + 16} className="a-txt">{p.n}</text></g><g className={p.chip}><rect x={248} y={p.y + 4} width={62} height={17} rx={8} className="a-kibg" /><text x={279} y={p.y + 16} className="a-klein a-akz" textAnchor="middle">✦ Entwurf</text></g></g>))}
        <text x={336} y={54} className="a-mono a-dim">AN ALLE 5 BIETER</text>
        {avatare.map((a, i) => (<g key={i}><path d={`M 400 166 L ${a.x} 93`} className={`a-strahl ${a.l}`} /><circle cx={a.x} cy={84} r={9} className={`a-avatar ${a.c}`} /></g>))}
        <g className={entwurf}>
          <rect x={150} y={166} width={314} height={130} rx={12} className="a-entwurf" />
          <text x={164} y={188} className="a-txt a-b a-akz">✦ Antwortentwurf</text>
          {[0, 1, 2].map((i) => <rect key={i} x={164} y={200 + i * 14} width={[270, 236, 180][i]} height={6} rx={3} className={`a-skel ${balken[i]}`} style={{ transformOrigin: '0 50%' }} />)}
          <g className={quellen}>{['L-201', 'LV 03.03', 'Brandschutz'].map((q, i) => (<g key={q}><rect x={164 + [0, 52, 118][i]} y={246} width={[46, 60, 76][i]} height={18} rx={5} className="a-quelle" /><text x={164 + [0, 52, 118][i] + [23, 30, 38][i]} y={259} className="a-klein a-blau" textAnchor="middle">{q}</text></g>))}</g>
          <rect x={364} y={262} width={88} height={24} rx={7} className={knopf} />
          <g className={kText1}><text x={408} y={278} className="a-klein a-inv" textAnchor="middle">Freigeben</text></g>
          <g className={kText2}><text x={408} y={278} className="a-klein a-inv" textAnchor="middle">✓ Gesendet</text></g>
          <circle cx={408} cy={274} r={20} className={`a-welle ${welle}`} />
        </g>
        <g className={maus}><path d="M 404 270 l 0 17 l 4.5 -4 l 3 7 l 3 -1.4 l -3 -6.8 l 6 -.3 z" className="a-maus" /></g>
      </g>
    </Buehne>
  );
}

// ---------- 6 Preisspiegel Position für Position ----------
type Zelle = [string, '' | 'best' | 'abw' | 'alt' | 'fehlt' | 'aus'];
export function AnimPreisspiegel() {
  const tl = new Tl('ap');
  const r = tl.root();
  const quellen = reihe(['RIB iTWO · X84', 'Outlook · PDF', 'Bieterportal', 'subreport'], 18).map((q, i) => ({ ...q, c: tl.show(3 + i * 4, 'transform:translateY(-8px)', 4) }));
  const bieter = ['Bauer', 'Meier', 'Schmid', 'Huber'];
  const colX = [148, 230, 312, 394], W = 74;
  const zeilen: [string, string, Zelle[]][] = [
    ['02.01', 'Ständerwand', [['66,32', ''], ['64,24', 'best'], ['68,24', ''], ['73,85', '']]],
    ['02.04', 'Zulage Höhe', [['9,27', ''], ['8,98', 'best'], ['9,54', ''], ['13,40', 'abw']]],
    ['03.01', 'Akustikdecke', [['69,30', 'best'], ['Alt. 61,90', 'alt'], ['70,78', ''], ['76,81', '']]],
    ['03.03', 'Revision', [['139,59', 'best'], ['377,00', 'abw'], ['142,59', ''], ['154,74', '']]],
    ['01.03', 'Gerüst', [['1.110', 'best'], ['1.210', ''], ['fehlt', 'fehlt'], ['1.194', '']]],
    ['04.02', 'Abschottung', [['39,89', 'best'], ['45,31', ''], ['47,15', ''], ['ausgeschlossen', 'aus']]],
  ];
  const kopf = bieter.map((_, b) => tl.show(14 + b * 12, 'transform:translateY(-6px)', 3));
  const zellen = zeilen.map((z, ri) => z[2].map((_, b) => tl.show(15 + b * 12 + ri * 1.4, 'transform:scale(.6)', 3)));
  let n = 0;
  const ringe = zeilen.map((z) => z[2].map(([, k]) => (k && k !== 'best' ? tl.show(66 + n++ * 3, 'transform:scale(1.25)', 3) : '')));
  const best = tl.a([[0, 'fill:var(--sheet)'], [62, 'fill:var(--sheet)'], [65, 'fill:var(--ok-bg)'], [100, 'fill:var(--ok-bg)']], 'fill:var(--ok-bg);');
  const bestT = tl.a([[0, 'fill:var(--ink)'], [62, 'fill:var(--ink)'], [65, 'fill:var(--ok)'], [100, 'fill:var(--ok)']], 'fill:var(--ok);');
  const legende = [['22/24 bepreist', 'ok'], ['2 Abweichungen', 'abw'], ['1 Alternative', 'alt'], ['1 fehlt', 'fehlt'], ['1 ausgeschlossen', 'aus']] as const;
  let lx = 18;
  const leg = legende.map(([t, k], i) => { if (i === 3) lx = 18; const x = lx, y = i < 3 ? 266 : 290; lx += Math.round(t.length * 6.2 + 34); return { t, k, x, y, c: tl.show(80 + i * 2, 'transform:translateY(6px)', 3) }; });
  const zellKlasse = { '': 'a-zelle', best: '', abw: 'a-z-abw', alt: 'a-z-alt', fehlt: 'a-z-fehlt', aus: 'a-z-aus' } as const;
  const textKlasse = { '': 'a-mono', best: 'a-mono a-b', abw: 'a-mono a-b a-abwt', alt: 'a-klein a-altt', fehlt: 'a-klein a-fixt', aus: 'a-klein a-dim0 a-k9' } as const;
  return (
    <Buehne tl={tl} label="Preisspiegel: jede Position mit allen Angeboten, Abweichungen, Alternativen und Ausschlüssen">
      <g className={r}>
        {quellen.map((q, i) => <Werkzeug key={q.n} n={q.n} x={q.x} y={12} w={q.w} k={i === 0 ? 'ava' : i === 1 ? 'ablage' : 'vergabe'} cls={q.c} />)}
        <text x={18} y={60} className="a-mono a-dim">OZ</text>
        {bieter.map((b, i) => <g key={b} className={kopf[i]}><text x={colX[i] + W / 2} y={60} className="a-txt a-b" textAnchor="middle">{b}</text></g>)}
        {zeilen.map(([oz, t, z], ri) => {
          const y = 70 + ri * 31;
          return (
            <g key={oz}>
              <text x={18} y={y + 16} className="a-mono a-dim">{oz}</text>
              <text x={60} y={y + 16} className="a-klein">{t}</text>
              {z.map(([v, k], b) => (
                <g key={b}>
                  <g className={zellen[ri][b]}>
                    <rect x={colX[b]} y={y} width={W} height={24} rx={5} className={k === 'best' ? `a-zelle ${best}` : zellKlasse[k]} />
                    <text x={colX[b] + W / 2} y={y + 16} className={k === 'best' ? `a-mono a-b ${bestT}` : textKlasse[k]} textAnchor="middle">{k === 'abw' ? `${v} ↑` : v}</text>
                  </g>
                  {ringe[ri][b] && <rect x={colX[b] - 3} y={y - 3} width={W + 6} height={30} rx={7} className={`a-ring a-ring-${k} ${ringe[ri][b]}`} />}
                </g>
              ))}
            </g>
          );
        })}
        {leg.map((l) => (
          <g key={l.t} className={l.c}>
            <rect x={l.x} y={l.y + 4} width={10} height={10} rx={3} className={`a-leg-${l.k}`} />
            <text x={l.x + 16} y={l.y + 13} className="a-klein a-legt">{l.t}</text>
          </g>
        ))}
      </g>
    </Buehne>
  );
}
