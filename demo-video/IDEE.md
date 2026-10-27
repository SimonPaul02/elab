# Idee und Storyboard: „LV mit KI erstellen“

## Idee

Ein Architekt soll für ein Gewerk ein vollständiges, prüfbares LV bekommen, ohne jede Position selbst zusammenzusuchen.
Er lädt hoch, was im Büro ohnehin vorliegt, beantwortet wenige Rückfragen und bekommt ein **normales, editierbares LV**,
bei dem jede Position zeigt, **woher sie kommt** und **wie ihre Menge entstanden ist**. Danach geht es ohne Medienbruch
weiter: Planänderungen einarbeiten, an Bieter senden, Angebote einsammeln, Preisspiegel.

### Wie das LV entsteht (Kern der Demo)

Ein LV besteht aus zwei Arten von Positionen, und beide brauchen Mengen:

1. **Positionen aus Bauteilen.** Aus den Plänen werden Bauteile erkannt und gemessen: Wandtypen, Decken, Öffnungen,
   Anschlüsse, Raumhöhen aus den Schnitten. Daraus entstehen die großen Positionen (m², m, Stück). Sie tragen
   den Großteil der Summe. Die Mengen werden nach den Abrechnungsregeln der VOB/C ermittelt, z. B. werden Öffnungen
   bis 2,5 m² übermessen.
2. **Lose Positionen**, die an keinem Bauteil hängen. Ihre Menge kommt aus anderen Quellen:
   - **Fachplanung:** Dosen und Leuchten aus dem Elektroplan, Revisionsöffnungen aus dem Lüftungsplan, Wandlasten aus
     dem Sanitärplan. Diese Mengen werden dort gezählt.
   - **Regeln:** ATV DIN 18340, Abschnitt 4.2: Besondere Leistungen werden als eigene Positionen ausgeschrieben.
   - **Büro-LVs, Datenbanken, Erfahrung:** Baustelleneinrichtung, Montageplanung, Stundenlohn. Hier ist die Menge
     ein Erfahrungswert und wird als „geschätzt“ gekennzeichnet.
   - **Rückfragen:** was die Unterlagen offen lassen, z. B. wer das Gerüst stellt oder welche Oberflächenqualität gilt.

Danach wird automatisch geprüft: **VOB/C** (Abschnitt 0 vollständig, keine Nebenleistungen ausschreiben, Besondere
Leistungen als eigene Positionen, Abrechnungsregeln), **Vergaberecht** (VOB/A § 7: eindeutig, produktneutral) und
**Lücken**, also Leistungen, die gebaut werden müssen, aber nicht ausgeschrieben sind und später zum Nachtrag würden.

### Neu in Fassung 3

- **IFC-Modell (3D):** Das Modell wird neben den Plänen gelesen. Bauteile werden im 3D-Modell erkannt und gemessen, der
  Grundriss bleibt als zweite Ansicht für die Fachplanung (Dosen, Leuchten, Revisionsöffnungen).
- **Import aus ORCA AVA und California.pro:** Alte LVs kommen direkt aus der AVA-Software, mit Texten, Gliederung und
  Preisen aus der Vergabe. GAEB und PDF gehen weiterhin.
- **Büro-Regelwerk und Textdatenbank:** Standardtexte (z. B. Vorbemerkungen TB-039-001) und Regeln des Büros
  („Aufenthaltsräume immer Q3“, „keine Produktnamen“, „Stundenlohn höchstens 2 %“) gelten für jedes LV und werden geprüft.
  Ersetzt den „Wissensschatz öffentlicher LVs“ (Produktentscheidung vom 26.10.: nur eigene LVs).
- **Gewerke-Paketierung:** Aus Modell und Fachplaner-Unterlagen schlägt der Assistent die Vergabeeinheiten vor (Trockenbau,
  Tischler, Maler, Bodenbelag, Elektro, Blitzschutz) mit Schätzung, Schnittstellen und Fachlos-Prüfung nach § 5 Abs. 2 VOB/A.
  Offene Entscheidungen (Akustikdecken als eigenes Los?) werden als Frage gestellt.
- **Fachplaner-Schnittstelle:** Fachplaner (Elektro, Blitzschutz, TGA, Tragwerk) liefern Pläne und eigene LVs als GAEB oder
  PDF in einen eigenen Bereich, alles synchronisiert, Rechte je Fachplaner. Die **Schnittstellenprüfung** gleicht alle LVs ab:
  doppelt ausgeschrieben, Mengen aus altem Planstand, fehlende Anschlüsse. Nachricht an den Fachplaner als Entwurf mit Freigabe.
- **Pläne ändern sich:** Neuer Modellstand und Fachplaner-Pläne kommen automatisch, die Änderung ist im 3D-Modell markiert,
  das LV wird angepasst, eigene Änderungen bleiben.
- **Datenschutz, kurz:** Server in Deutschland, DSGVO mit AV-Vertrag, kein Training mit Projektdaten, Rechte je Projekt,
  verschlüsselt und protokolliert. *Vor Veröffentlichung mit dem tatsächlichen Setup abgleichen.*
- **Vergabeplattform-Sync:** Veröffentlichung, Rückfragen, Bieterinformationen und Angebote laufen zwischen ava und der
  Vergabeplattform synchron. Bieter können im ava-Bieterportal oder auf der Plattform anbieten.
- **Angebote automatisch einlesen:** GAEB X84, PDF oder direkt eingetragen. Ein PDF-Angebot wird sichtbar gelesen, jeder
  Preis der Position zugeordnet, Summe und Auffälligkeiten geprüft.
- **Minimalistischeres UI:** schmale Leiste links, ruhige Farben. Im LV nur eine dezente Spalte „Herkunft“ statt mehrerer
  Etiketten, Prüfung rechts als kompakte, aufklappbare Liste.

### Vergaberecht im Ablauf

- Auftraggeber ist öffentlich (VOB/A). Angebote kommen deshalb nicht formlos per Mail, sondern über Bieterportal oder
  Vergabeplattform und bleiben bis zum **Eröffnungstermin verschlossen**. Erst danach werden sie eingelesen.
- Antworten auf Rückfragen gehen als **Bieterinformation an alle Bieter** und auf die Plattform, ohne Namen des
  Fragestellers (§ 12a Abs. 4 VOB/A). Nichts geht ohne Freigabe raus.
- Fachlose nach § 5 Abs. 2 VOB/A, Produktneutralität nach § 7, Aufklärung unvollständiger Angebote nach § 15.

### Kernbotschaften

- Mengen aus dem Modell und den Plänen, jede nachvollziehbar.
- Das LV folgt Ihrem Regelwerk und Ihren Standardtexten, geprüft gegen VOB/C und Vergaberecht.
- Fachplaner sind angebunden, Schnittstellen über alle LVs geprüft.
- Rückfragen der Bieter: Die KI entwirft mit Kontext, der Architekt gibt frei.
- Angebote aus Portal und Plattform automatisch eingelesen, Preisspiegel fertig.

## Storyboard (Fassung 3, 2:49 min)

Zeiten sind ungefähr. Einblendungen stehen unten links, mit „(rechts)“ markierte unten rechts.

| Zeit | Szene | Bild | Einblendung |
|---|---|---|---|
| 0:00 | **Titelkarte** | – | *Vom Modell zum Preisspiegel.* IFC-Modell und Pläne einlesen, alte LVs aus ORCA AVA oder California übernehmen · Gewerke paketieren, LV erstellen mit Ihrem Regelwerk und Ihren Standardtexten · Fachplaner angebunden, Schnittstellen über alle LVs geprüft · Rückfragen der Bieter: Die KI entwirft, Sie geben frei · Angebote als GAEB oder PDF automatisch eingelesen, Preisspiegel fertig. *Beispielwerte.* |
| 0:09 | Schritt 1: IFC und Pläne hochladen, Fachplaner-Unterlagen synchronisiert, Import aus ORCA AVA | `01-unterlagen` | **Schritt 1 · Unterlagen:** IFC-Modell, Pläne und Baubeschreibung hochladen. Pläne und LVs der Fachplaner kommen automatisch über den Sync dazu. — **Schritt 1 · Alte LVs:** Frühere LVs direkt aus ORCA AVA oder California.pro übernehmen, mit Texten und Preisen. |
| 0:21 | Schritt 2: Regelwerk und Textdatenbank | `02-regelwerk` | **Schritt 2 · Regelwerk und Textdatenbank:** Die Standardtexte und Regeln Ihres Büros gelten automatisch, etwa Q3 in Aufenthaltsräumen oder keine Produktnamen. Dazu die Prüfung gegen VOB/C und Vergaberecht. |
| 0:29 | Schritt 3: Gewerke, 3D-Modell nach Gewerken, Hover auf Tischler und Trockenbau | `03-gewerke` | **Schritt 3 · Gewerke:** Aus dem IFC-Modell schlägt der Assistent die Vergabeeinheiten vor, mit Schnittstellen und Prüfung der Fachlose nach § 5 VOB/A. |
| 0:38 | Schritt 4: Rückfragen | – | **Schritt 4 · Rückfragen:** Nur was offen ist, wird gefragt, mit Fundstelle und Vorschlag. |
| 0:41 | Erstellen: Bauteile im 3D-Modell, dann Grundriss mit Fachplanung, Prüfungen | `04-mengen`, `05-lose` | **Mengen aus dem 3D-Modell (rechts):** Der Assistent erkennt Wände, Türen, Anschlüsse und Decken im Modell und misst die Mengen nach VOB/C. Jede Menge bleibt nachvollziehbar. — **Positionen (rechts):** Aus jedem Bauteil wird eine Position. Dazu die losen Positionen aus den Plänen der Fachplaner, Ihre Standardtexte und Ihre Antworten. — **Prüfen (rechts):** VOB/C, Vergaberecht, Büro-Regelwerk und Lücken. Hier wird zum Beispiel der Stundenlohn nach Ihrer Regel auf 2 % begrenzt. |
| 0:59 | Das LV, 02.01 aufgeklappt, Prüfung „Lücken“ aufgeklappt | `06-lv` | **Das LV (rechts):** Bewusst schlicht: ein normales LV mit einer Spalte Herkunft. Langtext und Mengenermittlung zeigt ein Klick auf die Position. — **Prüfung:** Rechts kompakt alle Prüfungen. Aufgeklappt: fünf Lücken geschlossen, die sonst Nachträge geworden wären. |
| 1:08 | Fachplaner und Schnittstellen, „doppelt ausgeschrieben“ angeklickt, Nachricht freigegeben | `07-fachplaner` | **Fachplaner:** Elektro, Blitzschutz und TGA liefern Pläne und eigene LVs, als GAEB oder PDF. Alles bleibt synchron, jeder sieht nur seinen Teil. — **Schnittstellenprüfung (rechts):** Der Assistent gleicht alle LVs ab: doppelt ausgeschrieben, Mengen aus altem Planstand, fehlende Anschlüsse. Die Nachricht an den Fachplaner ist vorbereitet. |
| 1:20 | Datenschutz-Fenster | `08-datenschutz` | **Datenschutz (rechts):** Server in Deutschland, kein Training mit Ihren Daten, Rechte je Projekt und Rolle. |
| 1:26 | **Titelkarte** | – | *Zwei Wochen später: Die Pläne haben sich geändert.* Neuer Modellstand mit einer zusätzlichen Trennwand, mehr Dosen im Elektroplan, Technikraum jetzt EI 90. |
| 1:30 | Neue Planstände, Änderung im 3D-Modell, LV angepasst | `09-rerun` | **Neue Planstände:** Das neue Modell und der Elektroplan über den Fachplaner-Sync sind schon da. Die Änderung ist im Modell markiert. — **Änderungen (rechts):** Vier Mengen geändert, eine Position neu, dezent markiert. Eigene Änderungen bleiben erhalten. |
| 1:41 | Veröffentlichen und senden | `10-senden` | **Senden:** Veröffentlichung auf der Vergabeplattform und Versand an den Verteiler in einem Schritt. Angebote bleiben bis zur Eröffnung verschlossen. |
| 1:50 | **Titelkarte** | – | *Eine Woche später: Die Bieter haben Rückfragen.* Mail, Bieterportal und Vergabeplattform laufen in einem Postfach zusammen. |
| 1:54 | Postfach, Rückfrage Meier, Entwurf, bearbeiten, freigeben, Verlauf Meier | `11-antwort`, `12-bieter` | **Postfach:** Rückfragen, Absagen und offene Bieter. Für jede Nachricht liegt nach Sekunden ein Antwortentwurf bereit. — **Antwort mit Kontext (rechts):** Der Entwurf stützt sich auf LV-Position, Lüftungsplan, Brandschutzkonzept und Modell. Rechts steht, woher jede Aussage kommt. — **Vergaberecht (rechts):** Die Antwort geht als Bieterinformation an alle Bieter und auf die Plattform, ohne Namen des Fragestellers (§ 12a VOB/A). — **Human in the Loop:** Nichts geht ohne Freigabe raus. Der Architekt ergänzt einen Satz und gibt frei. — **Übersicht je Bieter (rechts):** Wer hat abgerufen, gefragt, welche Bieterinfo erhalten. Absagen erkennt die KI, Erinnerungen sind vorbereitet. |
| 2:20 | **Titelkarte**, dann Bieterportal: GAEB X84 hochladen, verschlüsselt abgeben | `13-portal` | *Sicht des Bieters: Angebot abgeben.* Im Bieterportal oder auf der Vergabeplattform: Preise eintragen oder die Kalkulation als GAEB X84 oder PDF hochladen. Beides wird synchronisiert. |
| 2:27 | **Titelkarte**, dann Angebote einlesen (PDF sichtbar) und Preisspiegel | `14-einlesen`, `15-preisspiegel` | *17.11., 12:00 · Eröffnungstermin: Angebote automatisch einlesen.* — **PDF-Angebot (rechts):** Jeder Preis wird erkannt und der richtigen Position zugeordnet. Summe und Auffälligkeiten werden geprüft. — **Preisspiegel (rechts):** Bester Preis grün, Ausreißer rot, fehlende Preise markiert. Rechts die Hinweise für die Prüfung. |
| 2:42 | **Schlusskarte** | – | *Vom Modell zum Preisspiegel.* IFC-Modell, Pläne und alte LVs aus ORCA AVA oder California · Gewerke paketiert, LV mit Ihrem Regelwerk erstellt und geprüft · Fachplaner synchron, Schnittstellen über alle LVs geprüft · Rückfragen mit Kontext beantwortet, gesendet erst nach Freigabe · Angebote aus Portal und Plattform automatisch im Preisspiegel · Daten in Deutschland, kein Training mit Ihren Daten |

## Beispieldaten auf einen Blick

- **Fachplaner:** Ing.-Büro Lechner (Elektro, LV 053 als GAEB), Planungsbüro Erdmann (Blitzschutz, LV 050 als PDF), TGA-Plan GmbH
  (Lüftung, Sanitär), Ing.-Büro Berger (Tragwerk). Alle Namen erfunden.
- **Gewerke:** 039 Trockenbau, 027 Tischler, 034 Maler, 036 Bodenbelag, 053 Elektro, 050 Blitzschutz.
- **Unterlagen:** IFC-Modell Index B, A-201 Grundriss, A-301 Schnitte, A-501 Türliste, Brandschutzkonzept, Statik,
  Baubeschreibung; von den Fachplanern E-201, LV 053, L-201, S-201, LV 050; alte LVs aus ORCA AVA / California:
  Kita Am Park 2023, Grundschule Nord 2022, Wohnanlage Isarauen 2024.
- **Bauteile:** W1 Ständerwand 412,5 m² · W2 Flurwand EI 30 186,2 m² · W3 Vorsatzschale 58,4 m² · Wandhöhe > 3 m 74,8 m² ·
  34 Türöffnungen · 296 m gleitender Deckenanschluss · D1 Akustikdecke 520 m² · D2 Flurdecke EI 30 148 m².
- **Positionen:** 9 aus Bauteilen, 10 lose; 5 geschlossene Lücken (Gerüst, Zulage Wandhöhe, gleitender Anschluss,
  Revisionsöffnungen, Leuchtenausschnitte).
- **Bieter:** Ausbau Huber (Vergabeplattform, X84), Bauer Akustik (Bieterportal, günstigster), Trockenbau Meier
  (Vergabeplattform, PDF, auffälliger EP bei 03.03), Schmid Innenausbau (Vergabeplattform, 01.03 nicht bepreist),
  Wagner (abgesagt), Keller (kein Angebot).
- **Nachrichten:** Rückfrage Meier zu 03.03 Revisionsöffnungen (→ Bieterinformation Nr. 1), Rückfrage Huber zum Gerüst 01.03,
  Rückfrage Schmid über die Vergabeplattform zu Bauabschnitten, Absage Wagner, Erinnerungsvorschlag für Keller.

## Offene Punkte

- Rechtsgrundlage Bieterinformation: Unterhalb der EU-Schwellen § 12a Abs. 4 VOB/A (unverzüglich, allen in gleicher Weise).
  Oberhalb gilt § 12a EU Abs. 3 VOB/A mit Frist spätestens 6 Kalendertage vor Ablauf der Angebotsfrist. Im Video steht
  nur „§ 12a VOB/A“, ggf. vor Veröffentlichung juristisch gegenlesen lassen.

- Der „Wissensschatz öffentlicher LVs“ ist in Fassung 3 nicht mehr im Video (Produktentscheidung vom 26.10.).
- Datenschutz-Aussagen, Anbindung an ORCA AVA, California.pro und Vergabeplattformen sind Zielvision. Vor Veröffentlichung
  klären, was technisch und vertraglich zugesagt werden kann.
- Mengen aus dem IFC-Modell setzen ein sauber modelliertes Modell voraus (Wandtypen, Räume, Höhen).
- Die Mengenerkennung aus Plänen ist Zielvision. Im Probelauf (Meschede) waren Flächen meist gut, Linien- und
  Stückmengen deutlich ungenauer (siehe Korridor-Auswertung im Forschungs-Repo).
