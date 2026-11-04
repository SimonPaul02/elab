// Kopf und Fuß teilen sich alle Seiten, damit sie nicht auseinanderlaufen.
// `aktiv` markiert die Seite in der Navigation. `termin` sagt, ob die Seite selbst den Pilot-Abschnitt
// mit dem Buchungskalender hat: dann springt „Pilot anfragen“ dorthin, sonst auf die Startseite.
import { Logo } from './Icons';

type Seite = 'start' | 'planer' | 'bau';

export function Kopf({ aktiv, termin = false }: { aktiv?: Seite; termin?: boolean }) {
  const nav: [Seite, string, string][] = [
    ['planer', '/planer/', 'Für Planer'],
    ['bau', '/bauunternehmen/', 'Für Bauunternehmen'],
  ];
  return (
    <header className="kopf">
      <div className="wrap kopf-in">
        <a href={aktiv === 'start' ? '#top' : '/'} className="kopf-logo"><Logo /></a>
        <nav className="kopf-nav" aria-label="Seiten">
          {nav.map(([id, href, text]) => (
            <a key={id} href={href} aria-current={aktiv === id ? 'page' : undefined}>{text}</a>
          ))}
        </nav>
        <a className="btn btn-dunkel" href={termin ? '#termin' : '/#termin'}>Pilot anfragen</a>
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
