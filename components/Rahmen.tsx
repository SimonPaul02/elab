// Kopf und Fuß teilen sich Startseite und Impressum, damit beide nicht auseinanderlaufen.
// `heim` steuert die Sprungziele: auf der Startseite reine Anker, sonst mit führendem /
// zurück auf die Startseite.
import { Logo } from './Icons';

export function Kopf({ heim = false }: { heim?: boolean }) {
  const an = (id: string) => (heim ? `#${id}` : `/#${id}`);
  return (
    <header className="kopf">
      <div className="wrap kopf-in">
        <a href={heim ? '#top' : '/'} className="kopf-logo"><Logo /></a>
        <nav className="kopf-nav" aria-label="Seitenbereiche">
          <a href={an('fluss')}>So funktioniert es</a><a href={an('datenschutz')}>Datenschutz</a>
        </nav>
        <a className="btn btn-dunkel" href={an('pilot')}>Pilot anfragen</a>
      </div>
    </header>
  );
}

export function Fuss() {
  return (
    <footer className="fuss">
      <div className="wrap fuss-in">
        <Logo />
        <p>Genannte Marken gehören ihren Inhabern.</p>
        <nav className="fuss-nav" aria-label="Rechtliches">
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutzerklaerung/">Datenschutzerklärung</a>
        </nav>
        <p className="mono">© 2026 plua ai</p>
      </div>
    </footer>
  );
}
