/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { ALLE_INTEGRATIONEN, DATENSCHUTZ, KATEGORIEN } from '../../lib/content';
import { GlyphIcon, Icon, ICON } from '../../components/Icons';
import Fluss from '../../components/Fluss';
import FlussScroll from '../../components/FlussScroll';
import Grundriss from '../../components/Grundriss';
import { Kopf, Fuss } from '../../components/Rahmen';
import Pilot from '../../components/Pilot';

export const metadata: Metadata = {
  title: 'plua ai · Für Planer: LV und Vergabe mit KI',
  description: 'plua ai erstellt Leistungsverzeichnisse aus Ihren Plänen, prüft gegen VOB/C und Vergaberecht und begleitet die Vergabe bis zum Preisspiegel.',
};

const DS_ICON = [ICON.server, ICON.noTrain, ICON.key, ICON.lock];

type Item = (typeof KATEGORIEN)[number]['items'][number];
function Kachel({ i, tint, klein = false }: { i: Item; tint: string; klein?: boolean }) {
  return (
    <div className={`kachel${klein ? ' klein' : ''}${i.logo ? ' mit-logo' : ''}`} data-tint={tint}>
      <span className="kachel-ico">{i.logo ? <img src={i.logo} alt="" height={24} /> : <GlyphIcon g={i.glyph} />}</span>
      <b>{i.name}</b>
    </div>
  );
}

export default function Planer() {
  const reihe1 = ALLE_INTEGRATIONEN.filter((_, k) => k % 2 === 0);
  const reihe2 = ALLE_INTEGRATIONEN.filter((_, k) => k % 2 === 1);
  return (
    <>
      <Kopf aktiv="planer" termin />

      <main id="top">
        {/* Hero als Planblatt: Raster, Grundriss, Maßkette */}
        <section className="hero">
          <div className="wrap">
            <div className="blatt">
              <Grundriss />
              <p className="eyebrow">KI für Architektur- und Ingenieurbüros</p>
              <h1>Vom Plan<br />zum Preisspiegel<span className="punkt">.</span></h1>
              <div className="hero-grid">
                <div className="hero-text">
                  <div className="masskette" aria-hidden="true">
                    {['Plan und Modell', 'LV', 'Vergabe', 'Preisspiegel'].map((t, k, a) => <span className="mk-teil" key={t}><i />{t}{k === a.length - 1 && <i className="ende" />}</span>)}
                  </div>
                  <p className="lead">Die KI-Plattform für Ausschreibung und Vergabe. Jedes Gewerk, Ihre Regeln, alle Beteiligten in einem System.</p>
                  <div className="cta-reihe">
                    <a className="btn btn-akzent" href="#demo"><Icon d={ICON.play} size={16} />Demo ansehen</a>
                    <a className="btn btn-linie" href="#fluss">So funktioniert es</a>
                  </div>
                </div>
              </div>

              <figure className="demo" id="demo">
                <div className="demo-leiste"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span>Demo · 1:15</span><span className="demo-hinweis">Prototyp, Beispielwerte</span></div>
                <video src="/demo.mp4" poster="/demo-poster.webp" controls autoPlay muted loop playsInline preload="metadata" />
              </figure>
            </div>
          </div>
        </section>

        {/* Laufband der Integrationen */}
        <section className="band" aria-label="Integrationen im Überblick">
          <div className="wrap band-kopf"><p>Arbeitet mit Ihren Werkzeugen</p></div>
          <div className="laufband">
            <div className="spur">{[...reihe1, ...reihe1].map((i, k) => <Kachel key={k} i={i} tint={i.tint} klein />)}</div>
            <div className="spur rueck">{[...reihe2, ...reihe2].map((i, k) => <Kachel key={k} i={i} tint={i.tint} klein />)}</div>
          </div>
        </section>

        {/* Große Scroll-Animation: alles fließt ins Modell, aus dem Modell entsteht das LV */}
        <FlussScroll><Fluss /></FlussScroll>

        {/* Grundsatz */}
        <section className="grundsatz">
          <div className="wrap grundsatz-in">
            <p className="gs-satz">Die KI schreibt vor.<br /><em>Sie entscheiden.</em></p>
            <p className="gs-text">Jede Menge mit Herkunft. Jede Nachricht erst nach Ihrer Freigabe.</p>
          </div>
        </section>

        {/* Datenschutz */}
        <section className="abschnitt" id="datenschutz">
          <div className="wrap ds">
            <div className="abschnitt-kopf">
              <p className="eyebrow">Datenschutz</p>
              <h2>Ihre Daten bleiben Ihre.</h2>
            </div>
            <div className="ds-grid">
              {DATENSCHUTZ.map(([t, x], k) => (
                <div className="ds-punkt" key={t}><span className="ds-ico"><Icon d={DS_ICON[k]} size={20} /></span><h3>{t}</h3><p>{x}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* Pilot */}
        <Pilot />
      </main>

      <Fuss />
    </>
  );
}
