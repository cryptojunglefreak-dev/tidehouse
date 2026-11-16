import type { FaqItem } from "../pl/faq";
import type { AreaOverlay } from "../types";

export const deDisclaimer =
  "Diese Präsentation dient nur der Information und ist kein verbindliches Angebot und keine Zusicherung von Verfügbarkeit, Preis oder Rendite. Preise, Verfügbarkeit, Ausstattung, Gebühren und Termine sind mit dem Bauträger zu bestätigen; maßgeblich ist der unterzeichnete Vertrag. Visualisierungen dienen der Veranschaulichung und können vom fertigen Objekt abweichen.";

export const deAreas: Record<string, AreaOverlay> = {
  Lamai: {
    coast: "Ostküste",
    lead: "Eine lange Bucht mit tieferem Wasser im mittleren Teil, zwei internationale Schulen und alles, was man für einen längeren Aufenthalt braucht.",
    points: [
      "Lamai International School und Windfield International School",
      "Lamai Night Market, Night Plaza und die Sonntags-Walking-Street",
      "Lotus’s und Makro für den täglichen Einkauf",
      "Felsen Hin Ta und Hin Yai, Wat Lamai, Aussichtspunkte",
    ],
  },
  Maenam: {
    coast: "Nordküste",
    lead: "Ein langer Strand mit Blick auf Koh Phangan und ruhigere Bebauung als in Chaweng. Gut für einen langsameren Rhythmus.",
    points: [
      "Morgenmarkt und der chinesische Tempel Chao Eng Sae",
      "18-Loch-Golfplatz Santiburi Samui Country Club",
      "Santiburi Spa und Restaurants am Strand",
      "Tempel Wat Na Phra Lan",
    ],
  },
  Bophut: {
    coast: "Nordküste",
    lead: "Grüne Hügel zwischen Bophut und Maenam. Nah am Fisherman’s Village, am Strand von Maenam und am Flughafen.",
    points: [
      "Fisherman’s Village mit Promenade und Restaurants",
      "W Beach Club und Chi Beach Club",
      "International School of Samui, Big C, Wattanapat Hospital",
      "Strand Maenam ca. 7 Min., Flughafen ca. 18 Min.",
    ],
  },
  "Plai Laem": {
    coast: "Nordöstliches Kap",
    lead: "Ruhige Strände für Sonnenuntergänge, die geschützte Bucht von Choeng Mon und der Flughafen nur wenige Minuten entfernt.",
    points: ["Wat Plai Laem mit der Guanyin-Statue und der Big Buddha", "Bucht von Choeng Mon zum Baden", "Fisherman’s Village für Abendspaziergänge", "Flughafen ca. 10 Minuten mit dem Auto"],
  },
  Chaweng: {
    coast: "Ostküste",
    lead: "Der bekannteste Strand der Insel: weißer Sand, eine lange Bucht und ein Einkaufszentrum wenige Minuten entfernt.",
    points: ["Strand von Chaweng mit feinem weißem Sand", "Central Samui — Geschäfte, Restaurants, Cafés", "Beach Club CLUB SEEN", "Chaweng-See"],
  },
  "Thong Krut": {
    coast: "Südküste",
    lead: "Der ruhige, vom Fischfang geprägte Süden der Insel: Bootsausflüge zu kleinen Inseln, eine goldene Pagode und Meerblick.",
    points: ["Bootsausflüge nach Koh Tan, Koh Madsum und Pig Island", "Goldene Pagode Laem Sor", "Greenacre International School", "Strand Lipa Noi und Na-Muang-Wasserfälle"],
  },
  Bangrak: {
    coast: "Nordküste",
    lead: "Strand und Beach Clubs an der Nordküste der Insel. Von den Anlegern in Bangrak geht es nach Koh Phangan.",
    points: ["Beach Clubs Chi Samui und The Deck", "Fisherman’s Village in Bophut mit Abendmarkt", "Big Buddha und Wat Plai Laem", "Anleger mit Booten nach Koh Phangan"],
  },
};

export const deFaq = (freeholdNames: string): FaqItem[] => [
  {
    question: "Was ist der Unterschied zwischen Freehold und Leasehold?",
    answer: [
      "Freehold ist volles Eigentum ohne zeitliche Begrenzung. Leasehold ist eine Pacht — meist über 30 Jahre; sie ist günstiger im Kauf, bei Villen kommt jedoch meist eine jährliche Grundstückspacht hinzu.",
      `Freehold ist möglich bei: ${freeholdNames}. Eigentumsform, Pachtdauer und Grundstückspacht stehen auf jeder Projektseite.`,
    ],
  },
  {
    question: "Sind Möbel im Preis enthalten?",
    answer: [
      "Das hängt vom Projekt ab. Möbel sind unter anderem bei Maenam Pool Villas, Lamai Lagoon Residences und Lamai Central Villas inklusive. Anderswo gibt es ein optionales Möbelpaket — zum Beispiel bei Lamai Rooftop Villa, Thong Krut Bay Villas und Plai Laem Pool Villas.",
      "Was enthalten ist, steht im Abschnitt „Ausstattung“ jedes Projekts und wird immer im Vertrag festgehalten.",
    ],
  },
  {
    question: "Welche Kosten fallen nach dem Kauf an?",
    answer: [
      "Bei Apartments: eine Gebühr für die Gemeinschaftsflächen (z. B. 80 THB/m² im Monat bei Bangrak Beach Apartments, 60 THB/m² bei Lamai Lagoon Residences) und ein einmaliger Rücklagefonds.",
      "Bei Villen mit Leasehold: eine jährliche Grundstückspacht — von ca. 19.000 bis ca. 105.000 THB je nach Projekt und Grundstück — und oft eine Anlagengebühr. Genaue Beträge stehen im Abschnitt „Kosten“ der Projektseite.",
    ],
  },
  {
    question: "Wie laufen die Zahlungen ab?",
    answer: [
      "Fast alle Projekte sind im Bau oder kurz davor, daher wird in Raten gezahlt: eine Reservierung (von 50.000 THB bis 10 % des Preises), danach Raten je nach Baufortschritt. Bei Lamai Park Villas bietet der Bauträger eine Finanzierung von bis zu 50 % des Preises für bis zu 5 Jahre.",
      "Die genauen Zahlungspläne finden Sie auf jeder Projektseite.",
    ],
  },
  {
    question: "Wann kann ich einziehen?",
    answer: [
      "Jedes Projekt hat einen eigenen Zeitplan: von ca. 6–8 Monaten Bauzeit (Lamai Family Villas) oder 7 Monaten (Lamai Central Villas) über ca. 18 Monate (Thong Krut Bay Villas) bis Ende 2028 (Lamai Lagoon Residences). Bei Lamai Park Villas beginnen die Übergaben im November 2026.",
      "Wo der Bauträger keinen Termin genannt hat, schreiben wir: noch zu bestätigen.",
    ],
  },
  {
    question: "In welcher Währung sind die Preise?",
    answer: ["Die Preise sind in Thai Baht (THB) angegeben, wie in den Preislisten der Bauträger. Maßgeblich ist der Vertrag mit dem Bauträger."],
  },
  {
    question: "Zeigen die Bilder fertige Häuser?",
    answer: ["Nein — es sind Visualisierungen der Bauträger. Sie dienen der Veranschaulichung und können vom fertigen Objekt abweichen. Jedes Bild auf der Website ist entsprechend gekennzeichnet."],
  },
  {
    question: "Kann ich Grundrisse bekommen?",
    answer: [
      "Grundrisse sind nicht Teil der Präsentationen der Bauträger. Fragen Sie über das Formular auf der Projektseite danach — wir sagen Ihnen, welche Unterlagen für den Grundriss verfügbar sind.",
    ],
  },
];

export const deProcess = [
  {
    title: "Auswahl und Prüfung",
    text: "Sie wählen Projekt und Grundriss. Vor dem Kauf bestätigen wir beim Bauträger Verfügbarkeit, Ausstattung, Registrierungsgebühren und Steuern sowie die Übertragungsbedingungen.",
  },
  {
    title: "Reservierung",
    text: "Die Reservierung beträgt je nach Projekt 50.000 THB bis 10 % des Preises. Danach wird der Vertrag mit dem Bauträger unterzeichnet.",
  },
  {
    title: "Vertrag und Ratenzahlung",
    text: "Die weiteren Raten zahlen Sie nach Baufortschritt: Fundament, Rohbau, Dach, Ausbau. Den Zahlungsplan jedes Projekts finden Sie auf seiner Seite.",
  },
  {
    title: "Abnahme und Übergabe",
    text: "Die letzte Rate — meist 3 % bis 10 % des Preises — wird bei der Übergabe fällig. Bei Leasehold wird die Pacht beim Grundbuchamt registriert.",
  },
];

export const deComparison: Record<string, { pool: string; furniture: string; handover: string; size: string }> = {
  "bangrak-beach-apartments": { pool: "Gemeinschaftspools", furniture: "Laut Vertrag mit dem Bauträger", handover: "2026 oder 2027", size: "53 Einheiten laut Preisliste vom 15.09.2026" },
  "lamai-rooftop-villa": { pool: "Privat, Salzwassersystem", furniture: "Nein — Paket 1,2 Mio. THB", handover: "Noch zu bestätigen", size: "Noch zu bestätigen" },
  "maenam-pool-villas": { pool: "Privat, in jeder Villa", furniture: "Ja, mit Einbauküche", handover: "Noch zu bestätigen", size: "12 Villen" },
  "lamai-bali-villas": { pool: "Privat, in jeder Villa", furniture: "Einbauküche; Rest noch zu bestätigen", handover: "Ca. 12 Monate Bauzeit", size: "5 Villen" },
  "maenam-trio-villas": { pool: "Privat, 6 × 3 m", furniture: "Option: +500.000 THB (ohne Geräte)", handover: "Noch zu bestätigen", size: "3 Villen" },
  "lamai-garden-villas": { pool: "Privat, 28,86–32,76 m²", furniture: "Im Vertrag festzulegen", handover: "Ca. 8 Monate nach Genehmigung", size: "8 Villen (laut Plan 6 verkauft)" },
  "chaweng-lake-villas": { pool: "Privat, ca. 23–24 m², Salzwasser", furniture: "Separates Paket; Küche und Klima inklusive", handover: "Noch zu bestätigen", size: "Noch zu bestätigen" },
  "bophut-hills-villas": { pool: "Privat, bei jedem Haus", furniture: "Noch zu bestätigen", handover: "Noch zu bestätigen", size: "10 Villen und 8 Lofts" },
  "thong-krut-bay-villas": { pool: "Privat, von 3 × 6 bis 4 × 9 m", furniture: "Option: Paket 550–750 Tsd. THB", handover: "Ca. 18 Monate Bauzeit", size: "24 Villen" },
  "plai-laem-pool-villas": { pool: "Privat, 5,8 × 2,4 oder 8,7 × 3 m", furniture: "Option: Paket ab 990.000 THB", handover: "Noch zu bestätigen", size: "14 Villen" },
  "lamai-lagoon-residences": { pool: "Gemeinschaftlich, im Lagunenstil", furniture: "Ja, schlüsselfertig", handover: "Ende 2028", size: "91 Apartments" },
  "lamai-tropical-villas": { pool: "Privat, in jeder Variante", furniture: "Option für 1–2 Schlafzimmer", handover: "Noch zu bestätigen", size: "Noch zu bestätigen" },
  "lamai-panorama-villas": { pool: "Privat, 23,8 / 28,9 m²", furniture: "Nein; Küche und Klima inklusive", handover: "Noch zu bestätigen", size: "Noch zu bestätigen" },
  "lamai-park-villas": { pool: "Privat, 24,5 m²", furniture: "Noch zu bestätigen", handover: "Ab November 2026", size: "Noch zu bestätigen" },
  "lamai-family-villas": { pool: "Privat, 32,6 m²", furniture: "Noch zu bestätigen", handover: "Ca. 6–8 Monate", size: "16 Villen" },
  "lamai-central-villas": { pool: "Privat", furniture: "Ja, schlüsselfertig", handover: "7 Monate ab Baubeginn", size: "6 Villen" },
};

export const deOwnership: Record<string, { freehold: string; leasehold: string; landRent: string }> = {
  "bangrak-beach-apartments": { freehold: "Ja — volles Eigentum ohne zeitliche Begrenzung", leasehold: "30 Jahre Pacht, etwas günstiger", landRent: "Entfällt (Condo); Unterhalt 80 THB/m² im Monat" },
  "lamai-rooftop-villa": { freehold: "Ja — 11.500.000 THB", leasehold: "7.500.000 THB; Pachtdauer noch zu bestätigen", landRent: "90.000 THB im Jahr, zahlbar alle 3 Jahre (270.000 THB)" },
  "maenam-pool-villas": { freehold: "Nein", leasehold: "Pachtdauer und Bedingungen noch zu bestätigen", landRent: "50.000–60.000 THB im Jahr; die ersten 2 Jahre frei" },
  "lamai-bali-villas": { freehold: "Nein", leasehold: "30 Jahre, Pacht auf den Käufer registriert", landRent: "60.000 THB im Jahr, zahlbar alle 5 Jahre; +5 % alle 5 Jahre" },
  "maenam-trio-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "72.000 THB im Jahr (6.000 THB im Monat)" },
  "lamai-garden-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "Nicht angegeben — noch zu bestätigen" },
  "chaweng-lake-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "70.000–99.000 THB im Jahr, 30 Jahre fest" },
  "bophut-hills-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "Lofts ab 19.442 THB, Villen ab 81.345 THB im Jahr; Änderungen in späteren Perioden" },
  "thong-krut-bay-villas": { freehold: "Nein", leasehold: "30 Jahre; Gebäude auf den Namen des Käufers", landRent: "60.000–84.000 THB im Jahr; +5 % alle 5 Jahre" },
  "plai-laem-pool-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "61.000–86.000 THB im Jahr, ohne Erhöhungen" },
  "lamai-lagoon-residences": { freehold: "Ja — ausgewählte Einheiten in der Ausländerquote", leasehold: "Nein", landRent: "Entfällt (Condo); Unterhalt 60 THB/m² im Monat" },
  "lamai-tropical-villas": { freehold: "Nein", leasehold: "Pacht im Preis enthalten; Dauer noch zu bestätigen", landRent: "Inklusive; Gemeinschaftsgebühr 2.500 THB im Monat (1–2 SZ)" },
  "lamai-panorama-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "70.000 THB im Jahr, zahlbar alle 3 Jahre (210.000 THB)" },
  "lamai-park-villas": { freehold: "Ja — Bedingungen je nach Käufer", leasehold: "Ja — Dauer und Preis noch zu bestätigen", landRent: "Noch zu bestätigen" },
  "lamai-family-villas": { freehold: "Nein", leasehold: "Bis 2055", landRent: "Ca. 60.000–90.000 THB im Jahr; frei bis 11/2030, +5 % alle 5 Jahre" },
  "lamai-central-villas": { freehold: "Nein", leasehold: "30 Jahre", landRent: "82.800–104.400 THB im Jahr" },
};
