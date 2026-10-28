'use client';
// Buchungskalender von Cal.com, inline eingebettet und direkt beim Seitenaufruf geladen.
// Das offizielle Snippet holt embed.js von app.cal.com und haengt den Kalender als iframe in den
// Container. `theme: auto` laesst das Widget der Systemeinstellung folgen, genau wie die uebrige
// Seite. Ohne JavaScript bleibt der Link im <noscript>.
//
// Das Embed laedt dabei auch lh3.googleusercontent.com und o574544.ingest.us.sentry.io
// (Fehlertracking, USA) und setzt das Cookie .cal.com __cf_bm. Das steht so im Abschnitt
// „Terminbuchung“ der Datenschutzerklaerung - bei Aenderungen hier dort mitziehen.
import { useEffect, useRef } from 'react';

export const CAL_LINK = 'plua-ai/intro';
const NS = 'intro';
const ZIEL = 'cal-buchung';

type CalFn = ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, CalFn>; q?: unknown[] };

export default function Buchung() {
  const gestartet = useRef(false);

  useEffect(() => {
    if (gestartet.current) return; // React ruft Effekte in der Entwicklung doppelt auf
    gestartet.current = true;

    const w = window as unknown as { Cal?: CalFn; document: Document };
    const schieben = (a: CalFn, ar: unknown) => { (a.q = a.q || []).push(ar); };

    if (!w.Cal) {
      const cal: CalFn = function (...ar: unknown[]) {
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const s = w.document.createElement('script');
          s.src = 'https://app.cal.com/embed/embed.js';
          w.document.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === 'init') {
          const api: CalFn = function (...a2: unknown[]) { schieben(api, a2); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns![namespace] = cal.ns![namespace] || api;
            schieben(cal.ns![namespace], ar);
            schieben(cal, ['initNamespace', namespace]);
          } else schieben(cal, ar);
          return;
        }
        schieben(cal, ar);
      };
      w.Cal = cal;
    }

    const Cal = w.Cal!;
    Cal('init', NS, { origin: 'https://app.cal.com' });
    Cal.ns![NS]('inline', {
      elementOrSelector: `#${ZIEL}`,
      config: { layout: 'month_view', theme: 'auto' },
      calLink: CAL_LINK,
    });
    Cal.ns![NS]('ui', { hideEventTypeDetails: false, layout: 'month_view', theme: 'auto' });
  }, []);

  return (
    <div className="buchung">
      <div id={ZIEL} className="buchung-rahmen" />
      <noscript>
        <p className="buchung-text">
          Für den Kalender wird JavaScript benötigt.{' '}
          <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer">Termin direkt bei Cal.com buchen</a>.
        </p>
      </noscript>
    </div>
  );
}
