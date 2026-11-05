'use client';
// Grafik „Herkunft im Plan“: Grundriss eines Bads, jede Wandseite der Position Wandfliesen ist markiert
// und nummeriert, darunter die Rechnung mit denselben Nummern. Werte passen zum Beispiel (lib/content.ts):
// Bad 3,04 × 2,25 m = 6,84 m², Fliesen bis +2,00 m: 21,16 − Tür 1,74 − Fenster 0,80 = 18,62 m².
// Als SVG gebaut statt Screenshot, damit es in jeder Größe scharf und lesbar bleibt. Maße in cm.
import { useState } from 'react';

type Zeile = { k: string; marke: string; name: string; rechnung: string; wert: string; abzug?: boolean };

const ZEILEN: Zeile[] = [
  { k: 'W1', marke: '1', name: 'Nordwand', rechnung: '3,04 × 2,00', wert: '6,08' },
  { k: 'W2', marke: '2', name: 'Ostwand', rechnung: '2,25 × 2,00', wert: '4,50' },
  { k: 'W3', marke: '3', name: 'Südwand', rechnung: '3,04 × 2,00', wert: '6,08' },
  { k: 'W4', marke: '4', name: 'Westwand', rechnung: '2,25 × 2,00', wert: '4,50' },
  { k: 'T1', marke: 'T1', name: 'Tür', rechnung: '0,87 × 2,00', wert: '−1,74', abzug: true },
  { k: 'F1', marke: 'F1', name: 'Fenster', rechnung: '1,00 × 0,80', wert: '−0,80', abzug: true },
];

// Innenkante des Raums
const X0 = 90, Y0 = 70, X1 = 394, Y1 = 295, D = 24;

// Fliesenlinien je Wandseite, 4 cm vor der Innenkante
const LINIEN: Record<string, [number, number, number, number]> = {
  W1: [X0, Y0 + 4, X1, Y0 + 4],
  W2: [X1 - 4, Y0, X1 - 4, Y1],
  W3: [X0, Y1 - 4, X1, Y1 - 4],
  W4: [X0 + 4, Y0, X0 + 4, Y1],
};
const ABZUG: Record<string, [number, number, number, number]> = {
  T1: [120, Y1 - 4, 207, Y1 - 4],
  F1: [190, Y0 + 4, 290, Y0 + 4],
};
const MARKEN: Record<string, [number, number]> = {
  W1: [140, Y0 + 4], W2: [X1 - 4, 232], W3: [300, Y1 - 4], W4: [X0 + 4, 236],
  T1: [163, Y1 + D / 2], F1: [240, Y0 - D / 2],
};

export default function Herkunft() {
  const [aktiv, setAktiv] = useState<string | null>(null);
  const dim = (k: string) => (aktiv && aktiv !== k ? ' is-dim' : '');
  const zeige = (k: string) => ({ onMouseEnter: () => setAktiv(k), onMouseLeave: () => setAktiv(null) });

  return (
    <figure className="herkunft">
      <div className="demo-leiste">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span>Grundriss_EG.pdf · Bad</span>
        <span className="demo-hinweis">Beispielwerte</span>
      </div>
      <div className="hk-in">
        <svg className="hk-plan" viewBox="0 0 440 340" role="img"
          aria-label="Grundriss Bad 3,04 × 2,25 m. Die vier Wandseiten sind für die Wandfliesen markiert und nummeriert, Tür und Fenster als Abzug.">
          {/* Maßketten */}
          <g className="hk-mass">
            <line x1={X0} y1={22} x2={X1} y2={22} />
            <line x1={X0 - 5} y1={27} x2={X0 + 5} y2={17} /><line x1={X1 - 5} y1={27} x2={X1 + 5} y2={17} />
            <text x={(X0 + X1) / 2} y={15} textAnchor="middle">3,04</text>
            <line x1={34} y1={Y0} x2={34} y2={Y1} />
            <line x1={29} y1={Y0 + 5} x2={39} y2={Y0 - 5} /><line x1={29} y1={Y1 + 5} x2={39} y2={Y1 - 5} />
            <text x={26} y={(Y0 + Y1) / 2} textAnchor="middle" transform={`rotate(-90 26 ${(Y0 + Y1) / 2})`}>2,25</text>
          </g>

          {/* Wände mit Öffnungen */}
          <path className="hk-wand" fillRule="evenodd"
            d={`M${X0 - D} ${Y0 - D}H${X1 + D}V${Y1 + D}H${X0 - D}Z M${X0} ${Y0}V${Y1}H${X1}V${Y0}Z`} />
          <rect className="hk-luecke" x={120} y={Y1 - 1} width={87} height={D + 2} />
          <rect className="hk-fenster" x={190} y={Y0 - D} width={100} height={D} />
          <line className="hk-fenster-glas" x1={190} y1={Y0 - D / 2} x2={290} y2={Y0 - D / 2} />

          {/* Einrichtung, nur angedeutet */}
          <rect className="hk-dusche" x={X1 - 90} y={Y0} width={90} height={90} />
          <text className="hk-klein" x={X1 - 45} y={Y0 + 50} textAnchor="middle">Dusche</text>
          <path className="hk-moebel" d={`M207 ${Y1} A87 87 0 0 0 120 ${Y1 - 87} V${Y1}`} />
          <rect className="hk-moebel" x={X0} y={96} width={46} height={58} rx={8} />

          <text className="hk-raum" x={232} y={170} textAnchor="middle">Bad</text>
          <text className="hk-klein" x={232} y={190} textAnchor="middle">6,84 m²</text>

          {/* Fliesenlinien und Abzüge */}
          {Object.entries(LINIEN).map(([k, [a, b, c, d]]) => (
            <line key={k} className={'hk-linie' + dim(k)} x1={a} y1={b} x2={c} y2={d} {...zeige(k)} />
          ))}
          {Object.entries(ABZUG).map(([k, [a, b, c, d]]) => (
            <g key={k} className={dim(k).trim()} {...zeige(k)}>
              <line className="hk-abzug-grund" x1={a} y1={b} x2={c} y2={d} />
              <line className="hk-abzug" x1={a} y1={b} x2={c} y2={d} />
            </g>
          ))}
          {ZEILEN.map((z) => {
            const [x, y] = MARKEN[z.k];
            return (
              <g key={z.k} className={(z.abzug ? 'hk-marke hk-marke-abzug' : 'hk-marke') + dim(z.k)} {...zeige(z.k)}>
                <circle cx={x} cy={y} r={z.abzug ? 13 : 11} />
                <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central">{z.marke}</text>
              </g>
            );
          })}
        </svg>

        <div className="hk-rechnung">
          <div className="hk-kopf">
            <strong>Wandfliesen 40/15</strong>
            <span className="hk-summe mono">18,62 m²</span>
          </div>
          <ol className="hk-zeilen">
            {ZEILEN.map((z) => (
              <li key={z.k} className={aktiv === z.k ? 'is-aktiv' : ''} {...zeige(z.k)}>
                <span className={z.abzug ? 'hk-nr abzug' : 'hk-nr'}>{z.marke}</span>
                <span className="hk-name">{z.name}{z.abzug && <small> abgezogen</small>}</span>
                <span className="hk-calc mono">{z.rechnung}</span>
                <span className="hk-wert mono">{z.wert}</span>
              </li>
            ))}
          </ol>
          <p className="hk-quelle mono">Längen aus Grundriss_EG.pdf · Höhe +2,00 m aus Wandansicht_Bad.pdf</p>
        </div>
      </div>
    </figure>
  );
}
