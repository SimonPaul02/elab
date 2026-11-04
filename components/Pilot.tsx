// Pilot-Abschnitt mit Buchungskalender, gleich auf Startseite, Planer- und Bauunternehmen-Seite.
import { KONTAKT_EMAIL } from '../lib/content';
import { Icon, ICON } from './Icons';
import Buchung from './Buchung';

export default function Pilot({ titel = 'Testen Sie plua ai an einem echten Projekt.' }: { titel?: string }) {
  return (
    <section className="pilot" id="pilot">
      <div className="wrap pilot-kopf">
        <p className="eyebrow">Pilotphase 2026</p>
        <h2>{titel}</h2>
        <p className="pilot-lead">Wählen Sie unten einen Termin — oder schreiben Sie uns, wir melden uns.</p>
        <a className="btn btn-linie" href={`mailto:${KONTAKT_EMAIL}?subject=Pilot%20plua%20ai`}>
          Per E-Mail anfragen <Icon d={ICON.arrow} size={16} />
        </a>
      </div>

      <div className="wrap" id="termin">
        <Buchung />
      </div>
    </section>
  );
}
