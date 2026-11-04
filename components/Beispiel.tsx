// Beispiel als Planblatt: Anfrage, was das System tut, und die Mengen als Ausgabe.
// Werte sind Beispielwerte (Hinweis in der Leiste), Texte in lib/content.ts.
import { BEISPIEL } from '../lib/content';

export default function Beispiel() {
  return (
    <figure className="beispiel">
      <div className="demo-leiste">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        <span>Beispiel · Bad</span>
        <span className="demo-hinweis">Beispielwerte</span>
      </div>
      <div className="bsp-in">
        <div className="bsp-schritt">
          <span className="bsp-wer">Anfrage</span>
          <p>{BEISPIEL.anfrage}</p>
        </div>
        <div className="bsp-schritt">
          <span className="bsp-wer">plua ai</span>
          <p>{BEISPIEL.system}</p>
        </div>
        <ol className="bsp-liste">
          {BEISPIEL.zeilen.map(([text, menge, einheit]) => (
            <li key={text}>
              <span className="bsp-text">{text}</span>
              <span className="bsp-menge mono">{menge}<small>{einheit}</small></span>
            </li>
          ))}
          <li className="bsp-weiter"><span className="bsp-text">…</span></li>
        </ol>
        <p className="bsp-fuss">{BEISPIEL.fuss}</p>
      </div>
    </figure>
  );
}
