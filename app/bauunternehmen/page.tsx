// Seite für Bauunternehmen und Generalunternehmer: Mengen für Angebot, Kalkulation und Aufmaß.
// Bewusst ohne Versprechen zu Anbindungen, die es noch nicht gibt (z. B. Aufmaß als GAEB X31/REB).
import type { Metadata } from 'next';
import { BAU_EINSATZ, KERN } from '../../lib/content';
import { Icon, ICON } from '../../components/Icons';
import Grundriss from '../../components/Grundriss';
import Beispiel from '../../components/Beispiel';
import Pilot from '../../components/Pilot';
import { Kopf, Fuss } from '../../components/Rahmen';

export const metadata: Metadata = {
  title: 'plua ai · Für Bauunternehmen: Mengen aus Plänen',
  description: 'plua ai ermittelt Mengen aus Plänen für Angebot, Kalkulation und Aufmaß, VOB-konform und prüfbar. Jeder Wert ist im Plan belegt.',
};

export default function Bauunternehmen() {
  return (
    <>
      <Kopf aktiv="bau" termin />

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="blatt">
              <Grundriss />
              <p className="eyebrow">Für Bauunternehmen und Generalunternehmer</p>
              <h1>Mengen für Angebot,<br />Kalkulation und Aufmaß<span className="punkt">.</span></h1>
              <div className="hero-grid">
                <div className="hero-text">
                  <div className="masskette" aria-hidden="true">
                    {['Plan', 'Angebot', 'Kalkulation', 'Aufmaß'].map((t, k, a) => <span className="mk-teil" key={t}><i />{t}{k === a.length - 1 && <i className="ende" />}</span>)}
                  </div>
                  <p className="lead">{KERN.satz}</p>
                  <div className="cta-reihe">
                    <a className="btn btn-akzent" href="#termin">Pilot anfragen <Icon d={ICON.arrow} size={16} /></a>
                    <a className="btn btn-linie" href="#demo"><Icon d={ICON.play} size={16} />Demo ansehen</a>
                  </div>
                </div>
              </div>

              <figure className="demo" id="demo">
                <div className="demo-leiste"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span>Demo · 1:21</span><span className="demo-hinweis">Prototyp, Beispielwerte</span></div>
                <video src="/demo.mp4" poster="/demo-poster.webp" controls autoPlay muted loop playsInline preload="metadata" />
              </figure>
            </div>
          </div>
        </section>

        <section className="abschnitt" id="einsatz">
          <div className="wrap einsatz">
            <div className="abschnitt-kopf">
              <p className="eyebrow">Einsatz</p>
              <h2>Eine Mengenermittlung für das ganze Projekt.</h2>
              <p className="abschnitt-lead">Dieselben Mengen werden in jedem Projekt mehrfach ermittelt und geprüft. plua ai ermittelt sie einmal, belegt im Plan, und Sie nutzen sie vom Angebot bis zur Schlussrechnung.</p>
            </div>
            <ol className="einsatz-liste">
              {BAU_EINSATZ.map((e) => (
                <li key={e.nr}>
                  <span className="einsatz-nr mono">{e.nr}</span>
                  <h3>{e.titel}</h3>
                  <p>{e.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="abschnitt abschnitt-dicht">
          <div className="wrap bau-beispiel">
            <div className="abschnitt-kopf">
              <p className="eyebrow">Beispiel</p>
              <h2>Mengen, die man sonst übersieht.</h2>
              <p className="abschnitt-lead">Nicht nur Flächen: auch Leibungen, Abdichtung und Anschlüsse, jeweils nach VOB/C ermittelt.</p>
            </div>
            <Beispiel />
          </div>
        </section>

        <section className="grundsatz">
          <div className="wrap grundsatz-in">
            <p className="gs-satz">Die KI ermittelt.<br /><em>Sie prüfen.</em></p>
            <p className="gs-text">Jeder Wert ist im Plan markiert und mit der VOB-Regel begründet. plua ai liefert Mengen, keine Preise. Grundlage sind die Pläne, nicht das Aufmaß vor Ort.</p>
          </div>
        </section>

        <Pilot />
      </main>

      <Fuss />
    </>
  );
}
