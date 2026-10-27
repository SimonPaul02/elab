/* eslint-disable @next/next/no-img-element */
import { ALLE_INTEGRATIONEN, DATENSCHUTZ, KATEGORIEN, KONTAKT_EMAIL } from '../lib/content';
import { GlyphIcon, Icon, ICON, Logo } from '../components/Icons';
import Fluss from '../components/Fluss';
import FlussScroll from '../components/FlussScroll';
import Grundriss from '../components/Grundriss';

const DS_ICON = [ICON.server, ICON.noTrain, ICON.key, ICON.lock];

type Item = (typeof KATEGORIEN)[number]['items'][number];
function Kachel({ i, tint, klein = false }: { i: Item; tint: string; klein?: boolean }) {
  return (
    <div className={`kachel${klein ? ' klein' : ''}`} data-tint={tint}>
      <span className="kachel-ico">{i.logo ? <img src={i.logo} alt="" width={22} height={22} /> : <GlyphIcon g={i.glyph} />}</span>
      <b>{i.name}</b>
    </div>
  );
}

export default function Home() {
  const reihe1 = ALLE_INTEGRATIONEN.filter((_, k) => k % 2 === 0);
  const reihe2 = ALLE_INTEGRATIONEN.filter((_, k) => k % 2 === 1);
  return (
    <>
      <header className="kopf">
        <div className="wrap kopf-in">
          <a href="#top" className="kopf-logo"><Logo /></a>
          <nav className="kopf-nav" aria-label="Seitenbereiche">
            <a href="#fluss">So funktioniert es</a><a href="#datenschutz">Datenschutz</a>
          </nav>
          <a className="btn btn-dunkel" href="#pilot">Pilot anfragen</a>
        </div>
      </header>

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
                <div className="demo-leiste"><span className="dots" aria-hidden="true"><i /><i /><i /></span><span>Demo · 2:49</span><span className="demo-hinweis">Prototyp, Beispielwerte</span></div>
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
        <section className="pilot" id="pilot">
          <div className="wrap pilot-in">
            <div>
              <p className="eyebrow">Pilotphase 2026</p>
              <h2>Testen Sie plua ai an einem echten Projekt.</h2>
            </div>
            <div className="pilot-kontakt">
              <a className="btn btn-akzent btn-gross" href={`mailto:${KONTAKT_EMAIL}?subject=Pilot%20plua%20ai`}>Pilot anfragen <Icon d={ICON.arrow} size={16} /></a>
              <p><span className="mono auswahl">{KONTAKT_EMAIL}</span></p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fuss">
        <div className="wrap fuss-in">
          <Logo />
          <p>Demo mit Beispielwerten. Genannte Marken gehören ihren Inhabern.</p>
          <p className="mono">© 2026 plua ai</p>
        </div>
      </footer>
    </>
  );
}
