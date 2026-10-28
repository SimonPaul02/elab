'use client';
// Buchungskalender von Cal.com, bewusst erst auf Klick geladen.
//
// Warum nicht direkt: Das Embed holt nicht nur app.cal.com, sondern auch
// lh3.googleusercontent.com und o574544.ingest.us.sentry.io (Fehlertracking, USA) und setzt ein
// Cookie (.cal.com __cf_bm). Ohne Klick waere das eine Einwilligung nach § 25 TDDG - und der Satz
// „Diese Website speichert keine Cookies“ in der Datenschutzerklaerung waere falsch. Wer nicht
// bucht, laedt so gar nichts von Cal.com. Der Link daneben fuehrt ohnehin direkt zu Cal.com.
import { useEffect, useRef, useState } from 'react';

export const CAL_LINK = 'plua-ai/intro';
const NS = 'intro';
const ZIEL = 'cal-buchung';

type CalFn = ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, CalFn>; q?: unknown[] };

export default function Buchung() {
  const [laden, setLaden] = useState(false);
  const gestartet = useRef(false);

  useEffect(() => {
    if (!laden || gestartet.current) return;
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
  }, [laden]);

  if (laden) return <div className="buchung"><div id={ZIEL} className="buchung-rahmen" /></div>;

  return (
    <div className="buchung">
      <div className="buchung-platz">
        <p className="buchung-text">
          Der Kalender wird von Cal.com geladen. Dabei erhält Cal.com Ihre IP-Adresse und setzt ein Cookie.
        </p>
        <div className="buchung-knoepfe">
          <button type="button" className="btn btn-akzent" onClick={() => setLaden(true)}>Kalender laden</button>
          <a className="btn btn-linie" href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noreferrer">Bei Cal.com öffnen</a>
        </div>
      </div>
    </div>
  );
}
