import type { ReactElement } from 'react';
import type { Glyph } from '../lib/content';

// Neutrale Symbole je Kategorie (keine Markenlogos). Strichstärke und Raster wie Bauplan-Symbole: 24er Raster, 1,6 px.
const P: Record<Glyph, ReactElement> = {
  ava: (<><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /><path d="M16.5 15.5l1.5 1.5 2.5-3" /></>),
  bim: (<><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></>),
  cad: (<><path d="M4 20 20 4" /><path d="M4 14v6h6" /><circle cx="17" cy="17" r="3" /><path d="M9 4h-5v5" /></>),
  format: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M10 12.5 8.5 14l1.5 1.5M14 12.5l1.5 1.5-1.5 1.5" /></>),
  norm: (<><path d="M15 5.5c-.6-1.2-1.8-2-3.3-2-2 0-3.4 1.2-3.4 2.8 0 3.8 7.4 2.6 7.4 6.6 0 1.4-1 2.4-2.4 2.8" /><path d="M9 18.5c.6 1.2 1.8 2 3.3 2 2 0 3.4-1.2 3.4-2.8 0-3.8-7.4-2.6-7.4-6.6 0-1.4 1-2.4 2.4-2.8" /></>),
  vergabe: (<><path d="M12 4v16M7 20h10" /><path d="M5 8h14" /><path d="M5 8 2.5 13.5a3 3 0 0 0 5 0z" /><path d="M19 8l-2.5 5.5a3 3 0 0 0 5 0z" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  cloud: (<><path d="M7 18a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.6 8.5 4.75 4.75 0 0 1 17.25 18z" /><path d="M12 11.5v5M9.8 14.2 12 16.5l2.2-2.3" /></>),
  platform: (<><path d="M12 3 21 8l-9 5-9-5z" /><path d="m3 12.5 9 5 9-5" /><path d="m3 16.5 9 5 9-5" /></>),
  sheet: (<><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M3.5 14.5h17M9.5 4v16" /></>),
  chat: (<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>),
};

export function GlyphIcon({ g, size = 22 }: { g: Glyph; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[g]}
    </svg>
  );
}

export function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export const ICON = {
  shield: 'M12 21.5s8-3.8 8-9.8V5l-8-3-8 3v6.7c0 6 8 9.8 8 9.8z M9 11.5l2 2 4-4',
  server: 'M4 4h16v6H4z M4 14h16v6H4z M7.5 7h.01 M7.5 17h.01',
  noTrain: 'M3 3l18 18 M10.6 5.1A7 7 0 0 1 19 12a7 7 0 0 1-1.1 3.8 M6.1 6.1A7 7 0 0 0 12 19a7 7 0 0 0 4-1.2',
  key: 'M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z M12 11v10 M12 15h3 M12 18h2',
  lock: 'M6 11h12v10H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  play: 'M7 4.5v15l12-7.5z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  edit: 'M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4',
};

/** Wort-Bild-Marke plua ai: ein Planblatt mit Achspunkt. */
export function Logo() {
  return (
    <span className="logo" aria-label="plua ai">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="1.5" y="1.5" width="23" height="23" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M1.5 9.5h23M9.5 9.5v15" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="17" r="3.4" fill="var(--accent)" />
      </svg>
      <span className="logo-wort">plua</span><span className="logo-ai">ai</span>
    </span>
  );
}
