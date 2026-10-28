// Datenschutzerklärung nach Art. 13 DSGVO. Bewusst knapp: Die Seite bindet keine Analyse ein,
// hat kein Formular, und ein Cookie entsteht nur, wenn jemand den Buchungskalender anfordert.
// Was hier steht, muss dem entsprechen, was die Seite tatsächlich tut - bei Änderungen an
// eingebundenen Diensten mit anpassen.
import type { Metadata } from 'next';
import { Kopf, Fuss } from '../../components/Rahmen';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung · plua ai',
  description: 'Wie plua.ai mit personenbezogenen Daten umgeht: Server-Logfiles, Hosting, Schriftarten, Terminbuchung, Ihre Rechte nach DSGVO.',
};

export default function Datenschutzerklaerung() {
  return (
    <>
      <Kopf />
      <main id="top">
        <section className="abschnitt">
          <div className="wrap">
            <div className="abschnitt-kopf">
              <p className="eyebrow">Rechtliches</p>
              <h2>Datenschutzerklärung</h2>
              <p className="abschnitt-lead">
                Diese Website bindet keine Analyse- oder Tracking-Dienste ein und erstellt keine Nutzungsprofile. Cookies
                setzt sie nur, wenn Sie den Buchungskalender ausdrücklich laden. Nachfolgend, welche Daten beim Aufruf
                anfallen und welche Rechte Sie haben.
              </p>
            </div>

            <div className="recht">
              <section>
                <h3>Verantwortlicher</h3>
                <p>
                  RSites GmbH<br />
                  Am Herrnberg 5<br />
                  93158 Teublitz<br />
                  Deutschland
                </p>
                <p>
                  Vertreten durch den Geschäftsführer Simon Röhrl.<br />
                  E-Mail: <a className="mono auswahl" href="mailto:mail@plua.ai">mail@plua.ai</a>
                </p>
              </section>

              <section>
                <h3>Aufruf der Website (Server-Logfiles)</h3>
                <p>
                  Beim Aufruf dieser Website überträgt Ihr Browser technisch notwendige Daten, die unser Hoster in
                  Logfiles speichert: IP-Adresse, Datum und Uhrzeit des Zugriffs, die aufgerufene Adresse, Statuscode
                  und übertragene Datenmenge, die zuvor besuchte Seite sowie Browsertyp, Browserversion und
                  Betriebssystem.
                </p>
                <p>
                  Zweck ist die Auslieferung der Seite sowie der sichere und störungsfreie Betrieb sowie die Abwehr von
                  Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in
                  genau diesem Betrieb. Die Daten werden nicht mit anderen Daten zusammengeführt und nach kurzer Zeit
                  gelöscht.
                </p>
              </section>

              <section>
                <h3>Hosting</h3>
                <p>
                  Diese Website wird bei der Vercel Inc. (USA) gehostet. Vercel verarbeitet die oben genannten Daten in
                  unserem Auftrag auf Grundlage eines Vertrags zur Auftragsverarbeitung nach Art. 28 DSGVO. Dabei kann
                  es zu einer Übermittlung in die USA kommen, die auf den Standardvertragsklauseln der Europäischen
                  Kommission beziehungsweise dem EU-US Data Privacy Framework beruht.
                </p>
              </section>

              <section>
                <h3>Schriftarten (Google Fonts)</h3>
                <p>
                  Zur einheitlichen Darstellung der Schrift lädt diese Website Schriftdateien von Servern der Google
                  Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei wird Ihre IP-Adresse an Google
                  übertragen; eine Übermittlung an die Google LLC in den USA ist dabei nicht ausgeschlossen.
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse liegt in der
                  einheitlichen Darstellung. Weitere Angaben unter{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    policies.google.com/privacy
                  </a>.
                </p>
              </section>

              <section>
                <h3>Kontaktaufnahme per E-Mail</h3>
                <p>
                  Ein Kontaktformular gibt es auf dieser Website nicht. Wenn Sie uns per E-Mail schreiben,
                  verarbeiten wir Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist
                  Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage der Anbahnung oder Durchführung eines Vertrags
                  dient, sonst Art. 6 Abs. 1 lit. f DSGVO. Wir löschen die Daten, sobald sie nicht mehr erforderlich
                  sind und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
                </p>
              </section>

              <section>
                <h3>Terminbuchung (Cal.com)</h3>
                <p>
                  Auf der Startseite können Sie einen Termin buchen. Der Kalender stammt von der Cal.com, Inc. (USA)
                  und wird <strong>erst geladen, wenn Sie ihn mit dem Knopf „Kalender laden“ ausdrücklich anfordern</strong>.
                  Solange Sie das nicht tun, wird keine Verbindung zu Cal.com aufgebaut.
                </p>
                <p>
                  Nach dem Laden erhält Cal.com Ihre IP-Adresse und setzt ein Cookie zur Angriffserkennung
                  (<span className="mono">__cf_bm</span>). Der Kalender lädt dabei zusätzlich Inhalte von
                  Google-Servern sowie einen Dienst zur Fehlererfassung (Sentry, USA). Buchen Sie einen Termin,
                  verarbeitet Cal.com die von Ihnen angegebenen Daten, um den Termin einzustellen.
                </p>
                <p>
                  Rechtsgrundlage für das Laden und das Cookie ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO
                  und § 25 Abs. 1 TDDG, die Sie mit dem Klick auf den Knopf erteilen. Sie können sie jederzeit
                  widerrufen, indem Sie die Seite neu laden und den Kalender nicht erneut anfordern. Für die
                  Terminvereinbarung selbst gilt Art. 6 Abs. 1 lit. b DSGVO. Weitere Angaben unter{' '}
                  <a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">cal.com/privacy</a>.
                </p>
              </section>

              <section>
                <h3>Keine Cookies, keine Analyse</h3>
                <p>
                  Abgesehen von dem Cookie, das der oben genannte Kalender nach Ihrer ausdrücklichen Anforderung
                  setzt, speichert diese Website keine Cookies. Sie nutzt weder Webanalyse noch Tracking,
                  Werbenetzwerke oder Social-Media-Plugins. Das eingebundene Demo-Video wird von unserem eigenen
                  Server ausgeliefert, nicht über einen Videodienst.
                </p>
              </section>

              <section>
                <h3>Ihre Rechte</h3>
                <p>
                  Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
                  Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Wenden Sie sich dafür
                  an die oben genannte Adresse.
                </p>
                <p>
                  Soweit wir Daten auf Grundlage eines berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO
                  verarbeiten, haben Sie nach Art. 21 DSGVO das Recht, dieser Verarbeitung aus Gründen zu
                  widersprechen, die sich aus Ihrer besonderen Situation ergeben.
                </p>
              </section>

              <section>
                <h3>Beschwerderecht bei der Aufsichtsbehörde</h3>
                <p>
                  Unbeschadet anderer Rechtsbehelfe steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
                  Für uns zuständig ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18,
                  91522 Ansbach.
                </p>
              </section>

              <section>
                <h3>Stand</h3>
                <p>Oktober 2026. Bei Änderungen an dieser Website passen wir diese Erklärung an.</p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Fuss />
    </>
  );
}
