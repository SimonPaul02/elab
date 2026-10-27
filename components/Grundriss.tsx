// Zarter Grundriss im Hero: Wände zeichnen sich beim Laden, eine Wand wird erkannt und bekommt ihre Menge.
// Reine Dekoration (aria-hidden), Farben über CSS-Variablen, Bewegung entfällt bei prefers-reduced-motion.
export default function Grundriss() {
  const innen = ['M 150 20 V 120', 'M 150 160 V 230', 'M 150 120 H 250', 'M 290 120 H 340', 'M 250 120 V 230', 'M 20 140 H 70', 'M 110 140 H 150'];
  return (
    <svg className="grundriss" viewBox="0 0 360 270" aria-hidden="true">
      {/* Außenwände, doppelt gezeichnet */}
      <rect x="14" y="14" width="332" height="222" className="gr-wand" style={{ ['--i' as string]: 0 }} />
      <rect x="20" y="20" width="320" height="210" className="gr-wand gr-innen" style={{ ['--i' as string]: 1 }} />
      {innen.map((d, i) => <path key={d} d={d} className="gr-wand gr-innen" style={{ ['--i' as string]: 2 + i }} />)}
      {/* Türen */}
      {['M 150 120 A 40 40 0 0 1 110 160', 'M 250 120 A 40 40 0 0 0 290 160', 'M 70 140 A 40 40 0 0 1 110 100'].map((d, i) => (
        <path key={d} d={d} className="gr-tuer" style={{ ['--i' as string]: 9 + i }} />
      ))}
      {/* Erkannte Wand W1 */}
      <rect x="147" y="20" width="6" height="100" className="gr-treffer" />
      <g className="gr-label">
        <rect x="160" y="52" width="104" height="24" rx="6" />
        <circle cx="172" cy="64" r="3.5" />
        <text x="181" y="68">W1 · 412,5 m²</text>
      </g>
      {/* Räume */}
      <text x="36" y="44" className="gr-raum">Gruppenraum</text>
      <text x="36" y="58" className="gr-raum gr-zahl">48,20 m²</text>
      <text x="268" y="44" className="gr-raum">Küche</text>
      <text x="168" y="148" className="gr-raum">Flur</text>
      <text x="268" y="196" className="gr-raum">WC</text>
      {/* Maßkette */}
      <g className="gr-mass">
        <path d="M 20 256 H 340 M 20 250 V 262 M 150 250 V 262 M 250 250 V 262 M 340 250 V 262" />
        <text x="85" y="250" textAnchor="middle">5,20</text>
        <text x="200" y="250" textAnchor="middle">4,00</text>
        <text x="295" y="250" textAnchor="middle">3,60</text>
      </g>
    </svg>
  );
}
