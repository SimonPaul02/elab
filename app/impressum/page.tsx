// Pflichtangaben nach § 5 DDG. Der Text ist rechtlich vorgegeben und wird nicht umformuliert.
import type { Metadata } from 'next';
import { Kopf, Fuss } from '../../components/Rahmen';

export const metadata: Metadata = {
  title: 'Impressum · plua ai',
  description: 'Anbieterangaben der RSites GmbH für plua ai gemäß § 5 des Gesetzes über digitale Dienste (DDG).',
};

export default function Impressum() {
  return (
    <>
      <Kopf />
      <main id="top">
        <section className="abschnitt">
          <div className="wrap">
            <div className="abschnitt-kopf">
              <p className="eyebrow">Rechtliches</p>
              <h2>Impressum</h2>
              <p className="abschnitt-lead">
                Angaben zum Anbieter gemäß § 5 des deutschen Gesetzes über digitale Dienste (DDG).
              </p>
            </div>

            <div className="recht">
              <section>
                <h3>Anbieter</h3>
                <p>
                  RSites GmbH<br />
                  Am Herrnberg 5<br />
                  93158 Teublitz<br />
                  Deutschland
                </p>
                <p>Vertreten durch den Geschäftsführer Simon Röhrl.</p>
              </section>

              <section>
                <h3>Kontakt</h3>
                <p><a className="mono auswahl" href="mailto:mail@plua.ai">mail@plua.ai</a></p>
              </section>

              <section>
                <h3>Handelsregister und Umsatzsteuer-Identifikationsnummer</h3>
                <p>
                  Handelsregister: Amtsgericht Amberg, HRB 7593<br />
                  Umsatzsteuer-Identifikationsnummer: DE362593080
                </p>
              </section>

              <section>
                <h3>Plua AI</h3>
                <p>
                  Plua AI ist ein von der RSites GmbH angebotener Dienst. Die Dienste werden ausschließlich an
                  Geschäftskunden angeboten.
                </p>
              </section>

              <section>
                <h3>Streitbeilegung</h3>
                <p>
                  Plua AI wird ausschließlich Geschäftskunden angeboten. Die RSites GmbH ist weder verpflichtet noch
                  bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle gemäß dem deutschen
                  Verbraucherstreitbeilegungsgesetz (VSBG) teilzunehmen.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Fuss />
    </>
  );
}
