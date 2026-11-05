// Startseite: kurz und allgemein. Kern (Vom Plan zur Menge), ein Beispiel, zwei Einstiege, Pilot.
// Der frühere Inhalt der Startseite (Ablauf bis zum Preisspiegel) steht unter /planer/.
import { EINSTIEGE, KERN } from '../lib/content';
import { Icon, ICON } from '../components/Icons';
import Grundriss from '../components/Grundriss';
import Beispiel from '../components/Beispiel';
import Pilot from '../components/Pilot';
import AlteAnker from '../components/AlteAnker';
import { Kopf, Fuss } from '../components/Rahmen';

export default function Home() {
  return (
    <>
      <AlteAnker />
      <Kopf aktiv="start" termin />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="blatt">
              <Grundriss />
              <p className="eyebrow">KI für Planung und Bau</p>
              <h1>Vom Plan<br />zur Menge<span className="punkt">.</span></h1>
              <div className="hero-grid">
                <div className="hero-text">
                  <p className="lead lead-gross">{KERN.satz}</p>
                  {KERN.zusatz.map((t) => <p className="lead lead-gross lead-zusatz" key={t}>{t}</p>)}
                  <div className="cta-reihe">
                    <a className="btn btn-akzent" href="#termin">Pilot anfragen <Icon d={ICON.arrow} size={16} /></a>
                    <a className="btn btn-linie" href="#einstiege">Für wen</a>
                  </div>
                </div>
              </div>

              <div className="start-beispiel"><Beispiel /></div>
            </div>
          </div>
        </section>

        <section className="abschnitt" id="einstiege">
          <div className="wrap einstiege">
            {EINSTIEGE.map((e) => (
              <a className="einstieg" href={e.href} key={e.id}>
                <p className="eyebrow">{e.eyebrow}</p>
                <h2>{e.titel}</h2>
                <ul>{e.punkte.map((p) => <li key={p}>{p}</li>)}</ul>
                <span className="einstieg-mehr">Mehr erfahren <Icon d={ICON.arrow} size={16} /></span>
              </a>
            ))}
          </div>
        </section>

        <Pilot />
      </main>

      <Fuss />
    </>
  );
}
