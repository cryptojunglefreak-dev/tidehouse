import type { Project } from "@/types/project";
import { units187 } from "./units-187";
import { contactDisclaimer } from "./shared";
import { newOffers } from "./offers";

/**
 * Project database.
 *
 * Every figure comes from the PDF brochures supplied by Domy w Tajlandii (Projekt 187, 220, 288, 304
 * below; Projekt 312–368 in ./offers). Nothing is estimated or recalculated:
 * PLN amounts are the approximate values printed in each PDF, each with its own exchange rate.
 *
 * To add a project: copy one object, add its photos to assets/source/<slug>/, run `npm run images`.
 * Items the brochures leave open are listed in `toConfirm` and shown to buyers as "do potwierdzenia".
 */


const baseProjects: Project[] = [
  /* ------------------------------------------------------------------ */
  /* PROJEKT 187 — Bangrak                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "bangrak-beach-apartments",
    ref: "187",
    name: "Bangrak Beach Apartments",
    shortName: "Bangrak",
    tagline: "100 m od plaży. Studio, 1 lub 2 sypialnie.",
    theme: { bg: "#dcEEF1", deep: "#0b4552", accent: "#136a79", label: "Laguna" },
    kind: "apartment",
    kindLabel: "Apartamenty",
    title: "Apartamenty 100 m od plaży w Bangrak",
    summary:
      "Condo na północnym wybrzeżu Koh Samui, 100 m od plaży, z rozbudowaną strefą basenową i tropikalną zielenią. Studio, 1 lub 2 sypialnie, freehold lub leasehold.",
    intro: [
      "Condo na północnym wybrzeżu Koh Samui, 100 metrów od plaży, z rozbudowaną strefą basenową i tropikalną zielenią. Dla osób szukających własnego miejsca na wyspie lub apartamentu pod wynajem.",
      "Apartament można kupić w pełnej własności bez ograniczenia czasowego (freehold) lub nieco taniej w systemie 30-letniej dzierżawy (leasehold). Odbiór możliwy już w 2026 roku albo później, w 2027, z płatnościami etapowymi.",
    ],
    location: {
      area: "Bangrak",
      island: "Koh Samui",
      label: "Bangrak, północne wybrzeże Koh Samui",
      mapQuery: "Bang Rak, Koh Samui, Thailand",
      mapPrecision: "area",
      proximity: "100 m od plaży",
    },
    ownership: ["freehold", "leasehold"],
    privatePool: false,
    ownershipNote: "Freehold — pełna własność bez ograniczenia czasowego. Leasehold — 30-letnia dzierżawa, niższa cena.",
    bedroomsLabel: "Studio, 1 lub 2 sypialnie",
    areaLabel: "28,11–58,68 m²",
    priceFrom: { thb: 2_990_000, pln: 347_674, ownership: "leasehold" },
    totalUnits: { value: 53, label: "lokali w cenniku z 15.09.2026" },
    unitTypes: [
      {
        id: "studio",
        label: "Studio",
        bedrooms: 0,
        area: "28,11–35,21 m²",
        areaMin: 28.11,
        areaMax: 35.21,
        prices: {
          leasehold: { thb: 2_990_000, pln: 347_674, from: true },
          freehold: { thb: 3_600_000, pln: 418_605, from: true },
        },
      },
      {
        id: "1br",
        label: "1 sypialnia",
        bedrooms: 1,
        area: "49,06 m²",
        areaMin: 49.06,
        areaMax: 49.06,
        prices: {
          leasehold: { thb: 5_784_174, pln: 672_578, from: true },
          freehold: { thb: 6_426_860, pln: 747_309, from: true },
        },
      },
      {
        id: "2br",
        label: "2 sypialnie",
        bedrooms: 2,
        area: "58,68 m²",
        areaMin: 58.68,
        areaMax: 58.68,
        prices: {
          leasehold: { thb: 9_095_400, pln: 1_057_605, from: true },
          freehold: { thb: 11_736_000, pln: 1_364_651, from: true },
        },
      },
    ],
    units: units187,
    highlights: [
      { title: "100 m od plaży", text: "Spacer nad morze bez organizowania transportu." },
      {
        title: "Dwie formy zakupu",
        text: "Freehold bez ograniczenia czasowego lub tańsza 30-letnia dzierżawa. Studio od 2,99 mln THB w leasehold.",
      },
      { title: "Trzy układy", text: "Studio, 1 lub 2 sypialnie — powierzchnie od 28,11 do 58,68 m²." },
      { title: "Odbiór w 2026 lub 2027 roku", text: "Możliwość późniejszego odbioru z płatnościami etapowymi." },
    ],
    keyFacts: [
      { label: "Lokalizacja", value: "Bangrak, 100 m od plaży" },
      { label: "Układy", value: "Studio, 1 lub 2 sypialnie" },
      { label: "Powierzchnia", value: "28,11–58,68 m²" },
      { label: "Forma zakupu", value: "Freehold lub leasehold (30 lat)" },
      { label: "Realizacja", value: "Odbiór w 2026 lub 2027" },
    ],
    features: ["Baseny", "Siłownia", "Restauracja", "Sky bar", "Concierge", "Windy"],
    standard: {
      included: ["Baseny, siłownia, restauracja, sky bar, concierge i windy w częściach wspólnych."],
      note: "Zakres wyposażenia apartamentu określa umowa z deweloperem.",
    },
    costs: [
      { label: "Utrzymanie", value: "80 THB/m² miesięcznie" },
      { label: "Fundusz remontowy", value: "800 THB/m²" },
    ],
    payment: {
      intro: "Przy odbiorze w 2027 roku możliwe są płatności etapowe. Harmonogram rat potwierdzamy dla wybranego lokalu.",
      stages: [],
    },
    completion: "Odbiór możliwy w 2026 roku lub później, w 2027 — z płatnościami etapowymi.",
    neighbourhoodTitle: "Plaża, gastronomia i wycieczki w Bangrak",
    neighbourhood: [
      {
        title: "Beach cluby przy morzu",
        text: "Chi Samui i The Deck — restauracje, baseny i leżaki na dzień nad wodą.",
      },
      {
        title: "Fisherman’s Village w Bophut",
        text: "Nadmorskie restauracje, butiki i wieczorny market — pomysł na kolację i zakupy.",
      },
      {
        title: "Big Buddha i Wat Plai Laem",
        text: "Charakterystyczne świątynie północnej części wyspy, które można połączyć w jedną wycieczkę.",
      },
      {
        title: "Przystanie Bangrak",
        text: "Połączenia w stronę Koh Phangan ułatwiają wycieczki poza Samui. Lotnisko zapewnia wygodne przyloty na krótsze pobyty.",
      },
    ],
    images: [
      { key: "bangrak-beach-apartments/aerial-beach", alt: "Widok z lotu ptaka na kompleks apartamentów przy plaży w Bangrak", caption: "Kompleks i plaża z lotu ptaka" },
      { key: "bangrak-beach-apartments/pool-bridge", alt: "Strefa basenowa z rzeźbiarską kładką między budynkami apartamentowymi", caption: "Strefa basenowa z kładką" },
      { key: "bangrak-beach-apartments/pool-courtyard", alt: "Basen otoczony palmami między budynkami kompleksu", caption: "Basen na dziedzińcu" },
      { key: "bangrak-beach-apartments/pool-arch", alt: "Basen z łukową instalacją i zielonymi wyspami", caption: "Część basenowa z łukiem" },
      { key: "bangrak-beach-apartments/interior-lounge", alt: "Jasne wnętrze apartamentu z okrągłym łóżkiem i strefą dzienną", caption: "Wnętrze apartamentu" },
      { key: "bangrak-beach-apartments/interior-bedroom-living", alt: "Wnętrze apartamentu z łóżkiem, sofą i biurkiem", caption: "Strefa sypialna i dzienna" },
      { key: "bangrak-beach-apartments/bedroom-window", alt: "Sypialnia z dużym przeszkleniem z widokiem na morze", caption: "Sypialnia" },
      { key: "bangrak-beach-apartments/bathroom", alt: "Łazienka z prysznicem typu walk-in i jasnymi okładzinami", caption: "Łazienka" },
    ],
    heroImage: "bangrak-beach-apartments/aerial-beach",
    cardImage: "bangrak-beach-apartments/pool-courtyard",
    priceDate: "15.09.2026",
    exchangeNote: "Ceny i dostępność: 15.09.2026. Przeliczenie: 1 PLN ≈ 8,60 THB (05.10.2026).",
    disclaimer: contactDisclaimer,
    floorPlans: "on-request",
    toConfirm: [
      "Aktualna dostępność lokali — cennik z 15.09.2026",
      "Harmonogram płatności etapowych przy odbiorze w 2027",
      "Zakres wyposażenia apartamentów",
      "Liczba łazienek w poszczególnych układach",
    ],
    sourcePdf: "Projekt_187_Bangrak_1-2bdr_od_419tys.pdf",
  },

  /* ------------------------------------------------------------------ */
  /* PROJEKT 220 — Lamai                                                 */
  /* ------------------------------------------------------------------ */
  {
    slug: "lamai-rooftop-villa",
    ref: "220",
    name: "Lamai Rooftop Villa",
    shortName: "Rooftop",
    tagline: "3 sypialnie, prywatny basen i pawilon na dachu.",
    theme: { bg: "#e2ede0", deep: "#22432d", accent: "#2d6239", label: "Palma" },
    kind: "villa",
    kindLabel: "Willa",
    title: "Willa z basenem i pawilonem na dachu w Lamai",
    summary:
      "Dom 275 m² z 3 sypialniami, prywatnym basenem, ogrodem i pawilonem na dachu. Działka 400–500 m², około 3 minuty samochodem do plaży Lamai.",
    intro: [
      "Dom z 3 sypialniami, prywatnym ogrodem i dodatkowym miejscem do wypoczynku na dachu. Około 3 minuty samochodem do plaży Lamai według dewelopera.",
      "Trzy sypialnie z prywatnymi łazienkami i dodatkowa toaleta przy części wspólnej. Mur wokół posesji, automatyczna brama i własny basen z systemem solnym tworzą prywatną przestrzeń do życia.",
    ],
    location: {
      area: "Lamai",
      island: "Koh Samui",
      label: "Lamai, Koh Samui",
      mapQuery: "Lamai, Koh Samui, Thailand",
      mapUrl: "https://maps.app.goo.gl/bCmXY77u9zA4VUeV6",
      mapPrecision: "project",
      proximity: "ok. 3 min samochodem do plaży Lamai (wg dewelopera)",
    },
    ownership: ["leasehold", "freehold"],
    privatePool: true,
    ownershipNote: "Leasehold jest o 4 000 000 THB (ok. 464 000 PLN) tańszy niż freehold; w leasehold dochodzi czynsz za grunt.",
    bedroomsLabel: "3 sypialnie",
    areaLabel: "Dom 275 m², działka 400–500 m²",
    priceFrom: { thb: 7_500_000, pln: 870_000, ownership: "leasehold" },
    unitTypes: [
      {
        id: "3br",
        label: "3 sypialnie",
        bedrooms: 3,
        bathrooms: "3 łazienki + toaleta",
        area: "Dom 275 m², działka 400–500 m²",
        areaMin: 275,
        areaMax: 275,
        prices: {
          leasehold: { thb: 7_500_000, pln: 870_000, from: false },
          freehold: { thb: 11_500_000, pln: 1_334_000, from: false },
        },
      },
    ],
    highlights: [
      {
        title: "3 sypialnie i 3 prywatne łazienki",
        text: "Wygodny układ dla rodziny lub gości; dodatkowa toaleta obsługuje część wspólną.",
      },
      {
        title: "Pawilon na dachu",
        text: "Oddzielne miejsce na wieczorny odpoczynek, wspólne posiłki lub spotkania z przyjaciółmi.",
      },
      {
        title: "Własny basen i działka 400–500 m²",
        text: "Ogród, mur wokół posesji i automatyczna brama tworzą prywatną przestrzeń do wypoczynku.",
      },
      {
        title: "Wyposażenie techniczne w cenie",
        text: "4 klimatyzatory, 4 wentylatory, oświetlenie, wyposażenie sanitarne, solny system basenowy i centralne podgrzewanie wody.",
      },
    ],
    keyFacts: [
      { label: "Lokalizacja", value: "Lamai, ok. 3 min autem do plaży" },
      { label: "Dom", value: "275 m²" },
      { label: "Działka", value: "400–500 m²" },
      { label: "Pomieszczenia", value: "3 sypialnie, 3 łazienki, toaleta" },
      { label: "Forma zakupu", value: "Leasehold lub freehold" },
    ],
    features: ["Prywatny basen z systemem solnym", "Pawilon na dachu", "Ogród", "Mur i automatyczna brama", "Własny parking"],
    standard: {
      included: [
        "4 klimatyzatory i 4 wentylatory",
        "Oświetlenie",
        "Wyposażenie sanitarne",
        "Solny system basenowy",
        "Centralne podgrzewanie wody",
      ],
      excluded: ["Kuchnia", "Meble"],
      note: "Pakiet meblowy wg dewelopera: 1 200 000 THB (ok. 139 200 PLN). Dom z pakietem: leasehold 8 700 000 THB (ok. 1 009 200 PLN), freehold 12 700 000 THB (ok. 1 473 200 PLN).",
    },
    costs: [
      { label: "Czynsz za grunt (leasehold)", value: "90 000 THB rocznie (ok. 10 440 PLN), płatny co 3 lata: 270 000 THB (ok. 31 320 PLN)" },
      { label: "Rezerwacja", value: "500 000 THB (ok. 58 000 PLN); podpisanie umowy w ciągu 30 dni" },
      { label: "Pakiet meblowy (opcja)", value: "1 200 000 THB (ok. 139 200 PLN)" },
    ],
    payment: {
      stages: [
        { label: "Podpisanie umowy", percent: 30, leasehold: { thb: 2_250_000, pln: 261_000 }, freehold: { thb: 3_450_000, pln: 400_200 } },
        { label: "Konstrukcja i konstrukcja dachu", percent: 25, leasehold: { thb: 1_875_000, pln: 217_500 }, freehold: { thb: 2_875_000, pln: 333_500 } },
        { label: "Dach, ściany i sufity", percent: 20, leasehold: { thb: 1_500_000, pln: 174_000 }, freehold: { thb: 2_300_000, pln: 266_800 } },
        { label: "Podłogi, stolarka, sanitariaty, malowanie", percent: 20, leasehold: { thb: 1_500_000, pln: 174_000 }, freehold: { thb: 2_300_000, pln: 266_800 } },
        { label: "Odbiór i przekazanie domu", percent: 5, leasehold: { thb: 375_000, pln: 43_500 }, freehold: { thb: 575_000, pln: 66_700 } },
      ],
      notes: ["Rezerwacja: 500 000 THB (ok. 58 000 PLN); podpisanie umowy w ciągu 30 dni."],
    },
    completion: "Termin ukończenia do potwierdzenia z deweloperem.",
    neighbourhoodTitle: "Plaża i wygoda na co dzień w Lamai",
    neighbourhood: [
      {
        title: "Plaża dla miłośników pływania",
        text: "Długa zatoka i głębsza woda w środkowej części odróżniają Lamai od płytkich zatok wyspy. Przy spokojnym morzu można pływać bez długiego brodzenia; warunki zależą od pogody.",
      },
      {
        title: "Trzy pomysły na wieczór",
        text: "Lamai Night Market — kolacja i muzyka; Lamai Night Plaza — pamiątki i drobne zakupy; VIA Village — jedzenie, kawiarnie i przestrzeń spotkań.",
      },
      {
        title: "Dwie szkoły międzynarodowe",
        text: "Lamai International School oraz Windfield International School pozwalają planować dłuższy pobyt z dziećmi; Windfield oferuje ścieżki brytyjską i francuską.",
      },
      {
        title: "Beach cluby i masaże",
        text: "Beach Republic na północy zatoki oraz Baobab przy plaży to miejsca na posiłek i odpoczynek nad wodą. Salony masażu w centrum ułatwiają relaks po plażowaniu.",
      },
      {
        title: "Trening w tropikach",
        text: "Punch It Gym i Lamai Muay Thai oferują treningi tajskiego boksu, a lokalne siłownie pozwalają utrzymać codzienną rutynę.",
      },
      {
        title: "Atrakcje na krótkie wypady",
        text: "Skały Hin Ta i Hin Yai, świątynia Wat Lamai oraz punkt widokowy Overlap Stone.",
      },
      {
        title: "Zakupy na dłuższy pobyt",
        text: "Lotus’s i Makro w Lamai ułatwiają zaopatrzenie domu; w centrum są restauracje, kawiarnie, apteki i codzienne usługi.",
      },
    ],
    images: [
      { key: "lamai-rooftop-villa/villa-garden", alt: "Biała willa z basenem i ogrodem na tle zielonych wzgórz Lamai", caption: "Willa od strony ogrodu i basenu" },
      { key: "lamai-rooftop-villa/aerial", alt: "Willa z lotu ptaka z dachem, podjazdem i otaczającą zielenią", caption: "Willa z lotu ptaka" },
      { key: "lamai-rooftop-villa/entrance", alt: "Fasada wejściowa willi z bramą i oświetleniem wieczornym", caption: "Wejście i fasada" },
      { key: "lamai-rooftop-villa/living-kitchen", alt: "Otwarta strefa dzienna z kuchnią, jadalnią i widokiem na ogród", caption: "Strefa dzienna z kuchnią" },
      { key: "lamai-rooftop-villa/living-room", alt: "Salon z sofą otwarty na taras i basen", caption: "Salon otwarty na taras" },
      { key: "lamai-rooftop-villa/bedroom-wardrobe", alt: "Sypialnia z garderobą i przeszkleniem na ogród", caption: "Sypialnia z garderobą" },
      { key: "lamai-rooftop-villa/bedroom-bathtub", alt: "Sypialnia z wolnostojącą wanną i drewnianymi detalami", caption: "Sypialnia z wanną" },
      { key: "lamai-rooftop-villa/bedroom-guest", alt: "Sypialnia z łóżkiem, lampą wiszącą i drewnianą zabudową", caption: "Sypialnia" },
      { key: "lamai-rooftop-villa/bathroom", alt: "Łazienka z wanną wolnostojącą i kamiennymi okładzinami", caption: "Łazienka" },
    ],
    heroImage: "lamai-rooftop-villa/villa-garden",
    cardImage: "lamai-rooftop-villa/villa-garden",
    exchangeNote: "Kwoty w PLN są orientacyjne. Przelicznik: 1 THB = 0,116 PLN.",
    disclaimer: contactDisclaimer,
    floorPlans: "on-request",
    toConfirm: ["Termin ukończenia", "Liczba domów w projekcie i ich dostępność", "Dokładna powierzchnia działki dla wybranego domu (400–500 m²)"],
    sourcePdf: "Projekt_220_Lamai_3bdr_od_870tys.pdf",
  },

  /* ------------------------------------------------------------------ */
  /* PROJEKT 288 — Maenam                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "maenam-pool-villas",
    ref: "288",
    name: "Maenam Pool Villas",
    shortName: "Maenam",
    tagline: "12 willi z prywatnym basenem. Meble w cenie.",
    theme: { bg: "#f2e7d5", deep: "#58401f", accent: "#80561c", label: "Piasek" },
    kind: "villa",
    kindLabel: "Wille",
    title: "Wille z prywatnym basenem w Maenam",
    summary:
      "Kameralne osiedle 12 willi w stylu organic modern: ciepłe odcienie, naturalne faktury i tropikalna zieleń. 1, 2 lub 3 sypialnie, prywatny basen i meble w cenie.",
    intro: [
      "Kameralne osiedle 12 willi w stylu organic modern: ciepłe odcienie, naturalne faktury i tropikalna zieleń. Trzy warianty domu, z meblami w cenie.",
      "Każda willa ma kuchnię, taras i prywatny basen — także najmniejsza, z jedną sypialnią. Na miejscu działa recepcja i personel techniczny, a nieruchomością można powierzyć zarządzanie.",
    ],
    location: {
      area: "Maenam",
      island: "Koh Samui",
      label: "Maenam, Soi 3, Koh Samui",
      mapQuery: "Maenam Soi 3, Koh Samui, Thailand",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Maenam+Soi+3+Koh+Samui",
      mapPrecision: "area",
    },
    ownership: ["leasehold"],
    privatePool: true,
    ownershipNote: "Leasehold — długość i szczegółowe warunki dzierżawy do potwierdzenia.",
    bedroomsLabel: "1, 2 lub 3 sypialnie",
    areaLabel: "ok. 135–253 m²",
    priceFrom: { thb: 4_500_000, pln: 522_000, ownership: "leasehold" },
    totalUnits: { value: 12, label: "willi na osiedlu" },
    unitTypes: [
      {
        id: "1br",
        label: "1 sypialnia",
        bedrooms: 1,
        bathrooms: "1 łazienka + toaleta",
        area: "ok. 135 m²",
        areaMin: 135,
        areaMax: 135,
        count: 4,
        prices: { leasehold: { thb: 4_500_000, pln: 522_000, from: false } },
      },
      {
        id: "2br",
        label: "2 sypialnie",
        bedrooms: 2,
        bathrooms: "2 łazienki + toaleta",
        area: "ok. 225 m²",
        areaMin: 225,
        areaMax: 225,
        count: 3,
        prices: { leasehold: { thb: 6_800_000, pln: 789_000, from: false } },
      },
      {
        id: "3br",
        label: "3 sypialnie",
        bedrooms: 3,
        bathrooms: "3 łazienki + toaleta",
        area: "ok. 253 m²",
        areaMin: 253,
        areaMax: 253,
        count: 5,
        prices: { leasehold: { thb: 7_650_000, pln: 887_000, from: false } },
      },
    ],
    highlights: [
      { title: "Tylko 12 willi", text: "4 domy z 1 sypialnią, 3 z 2 sypialniami i 5 z 3 sypialniami." },
      { title: "Prywatny basen w każdym wariancie", text: "Własna przestrzeń wypoczynku także w najmniejszym domu." },
      { title: "Meble i wyposażenie w cenie", text: "Łatwiej zaplanować budżet przygotowania domu do użytkowania." },
      {
        title: "Obsługa na miejscu",
        text: "Recepcja, personel techniczny, serwis wózka golfowego i możliwość zarządzania nieruchomością.",
      },
    ],
    keyFacts: [
      { label: "Lokalizacja", value: "Maenam, Soi 3" },
      { label: "Warianty", value: "1, 2 lub 3 sypialnie" },
      { label: "Powierzchnia", value: "ok. 135 / 225 / 253 m²" },
      { label: "Forma zakupu", value: "Leasehold" },
      { label: "Osiedle", value: "12 willi" },
    ],
    features: ["Prywatny basen", "Taras", "Wyposażona kuchnia", "Meble w cenie", "Recepcja", "Serwis wózka golfowego"],
    standard: {
      included: ["Meble", "Wyposażona kuchnia", "Klimatyzacja", "Wentylatory sufitowe"],
      note: "Styl organic modern: ciepłe odcienie, naturalne faktury i tropikalna zieleń.",
    },
    costs: [
      {
        label: "Dzierżawa gruntu rocznie",
        value: "50 000 THB dla 1 sypialni (ok. 5 800 PLN), 55 000 THB dla 2 sypialni (ok. 6 380 PLN), 60 000 THB dla 3 sypialni (ok. 6 960 PLN). Pierwsze 2 lata bez opłaty za grunt.",
      },
      { label: "Opłata osiedlowa", value: "25 000 THB rocznie (ok. 2 900 PLN)" },
      { label: "Rejestracja dzierżawy", value: "Przygotowanie i rejestracja bez dodatkowej opłaty" },
      { label: "Zarządzanie najmem", value: "Zakres usług i ceny do ustalenia" },
    ],
    payment: {
      stages: [
        { label: "Rezerwacja", percent: 10 },
        { label: "Podpisanie umowy", percent: 30 },
        { label: "Po konstrukcji i dachu", percent: 30 },
        { label: "Po pracach ściennych i sufitach", percent: 15 },
        { label: "Po wykończeniu", percent: 10 },
        { label: "Przy odbiorze", percent: 5 },
      ],
      notes: ["Dla najtańszego domu rezerwacja wynosi 450 000 THB (ok. 52 200 PLN)."],
    },
    completion: "Termin ukończenia do potwierdzenia dla wybranego domu.",
    neighbourhoodTitle: "Okolica i styl życia w Maenam",
    neighbourhood: [
      {
        title: "Plaża z widokiem na Koh Phangan",
        text: "Długa linia brzegowa sprzyja spacerom; palmy, restauracje przy wodzie i mniej intensywna zabudowa niż w Chaweng tworzą przestrzeń na spokojny dzień nad morzem.",
      },
      {
        title: "Smaki lokalnego Maenam",
        text: "Poranny targ to miejsce na świeże owoce i tajskie śniadanie. W centrum znajduje się kolorowa chińska świątynia Chao Eng Sae.",
      },
      {
        title: "Golf wśród palm",
        text: "18-dołkowe Santiburi Samui Country Club na wzgórzach łączy sport z widokami na zatokę i Koh Phangan.",
      },
      {
        title: "Relaks z konkretnym adresem",
        text: "Santiburi Spa oraz restauracje resortu przy plaży — masaż i posiłek nad morzem; dostęp i rezerwacje ustala się z obiektem.",
      },
      {
        title: "Wat Na Phra Lan",
        text: "Świątynia w zachodniej części Maenam, okazja do poznania lokalnej kultury poza najbardziej obleganymi atrakcjami wyspy.",
      },
    ],
    images: [
      { key: "maenam-pool-villas/pool-courtyard", alt: "Willa w kształcie litery L z prywatnym basenem i białymi elewacjami", caption: "Willa z prywatnym basenem" },
      { key: "maenam-pool-villas/kitchen-dining", alt: "Kuchnia z drewnianymi belkami, stół jadalniany i wiklinowa lampa", caption: "Kuchnia i jadalnia" },
      { key: "maenam-pool-villas/patio-pool", alt: "Patio z płytkim basenem, pergolą i tropikalnymi roślinami", caption: "Patio z basenem" },
      { key: "maenam-pool-villas/terrace", alt: "Przeszklona fasada willi z rattanowymi fotelami przy basenie", caption: "Taras przy basenie" },
    ],
    heroImage: "maenam-pool-villas/pool-courtyard",
    cardImage: "maenam-pool-villas/pool-courtyard",
    exchangeNote: "Kwoty w PLN są orientacyjne; przelicznik 1 THB = 0,116 PLN.",
    disclaimer: contactDisclaimer,
    floorPlans: "on-request",
    toConfirm: [
      "Długość i szczegółowe warunki dzierżawy",
      "Termin ukończenia dla wybranego domu",
      "Zakres i ceny usług zarządzania",
      "Dostępność poszczególnych willi",
    ],
    sourcePdf: "Projekt_288_Maenam_1-3bdr_od_522tys.pdf",
    internalNotes: [
      "Na wizualizacjach widnieje znak „The Serenity Escape Samui” — w tekście PDF nazwa nie występuje, więc strona jej nie używa.",
      "PDF podaje powierzchnie „ok. 135 / 225 / 253 m²” bez rozróżnienia na dom i działkę.",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* PROJEKT 304 — Lamai                                                 */
  /* NOTE: the PDF file name says "Maenam", while the brochure content   */
  /* (title, location, map link, neighbourhood) consistently says Lamai. */
  /* The site follows the brochure content — confirm with the developer. */
  /* ------------------------------------------------------------------ */
  {
    slug: "lamai-bali-villas",
    ref: "304",
    name: "Lamai Bali Villas",
    shortName: "Bali",
    tagline: "5 parterowych willi w stylu balijskim.",
    theme: { bg: "#f5e2e3", deep: "#682b38", accent: "#9a4153", label: "Frangipani" },
    kind: "villa",
    kindLabel: "Wille",
    title: "Parterowe wille z prywatnym basenem w Lamai",
    summary:
      "Kameralne osiedle 5 parterowych willi w stylu balijskim. 1 lub 2 sypialnie, prywatny basen i zadaszony taras w tropikalnej zieleni.",
    intro: [
      "Kameralne osiedle pięciu parterowych willi w stylu balijskim. Jedna lub dwie sypialnie, prywatny basen i zadaszony taras w tropikalnej zieleni — na zimowe pobyty lub do życia na wyspie.",
      "Salon i wyposażona kuchnia z barem śniadaniowym otwierają się na taras. Budowa trwa około 12 miesięcy, a płatności są rozłożone na etapy.",
    ],
    location: {
      area: "Lamai",
      island: "Koh Samui",
      label: "Lamai, Koh Samui",
      mapQuery: "Lamai, Koh Samui, Thailand",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Lamai+Koh+Samui",
      mapPrecision: "area",
      proximity: "Plaża Lamai ok. 3,1 km (wg dewelopera)",
    },
    ownership: ["leasehold"],
    privatePool: true,
    ownershipNote: "Leasehold — 30-letnia dzierżawa rejestrowana na kupującego.",
    bedroomsLabel: "1 lub 2 sypialnie",
    areaLabel: "65–84 m² wnętrz + taras",
    priceFrom: { thb: 4_800_000, pln: 559_000, ownership: "leasehold" },
    totalUnits: { value: 5, label: "willi na osiedlu" },
    unitTypes: [
      {
        id: "1br",
        label: "1 sypialnia",
        bedrooms: 1,
        bathrooms: "1 łazienka",
        area: "ok. 65 m² wnętrz + 33 m² części zewnętrznej",
        areaMin: 65,
        areaMax: 65,
        prices: { leasehold: { thb: 4_800_000, pln: 559_000, from: true } },
      },
      {
        id: "2br",
        label: "2 sypialnie",
        bedrooms: 2,
        bathrooms: "2 łazienki",
        area: "ok. 84 m² wnętrz + 34 m² części zewnętrznej",
        areaMin: 84,
        areaMax: 84,
        prices: { leasehold: { thb: 5_800_000, pln: 675_000, from: true } },
      },
    ],
    highlights: [
      {
        title: "Tylko 5 willi",
        text: "Niewielkie osiedle zamiast dużego kompleksu. Własny basen i zadaszony taras zapewniają przestrzeń do wypoczynku.",
      },
      {
        title: "Dwa praktyczne warianty",
        text: "1 sypialnia dla pary lub 2 sypialnie z osobnymi łazienkami, gdy przyjeżdża rodzina albo goście.",
      },
      {
        title: "Blisko codziennych spraw",
        text: "Windfield International School ok. 850 m, Lotus’s ok. 2 km, plaża Lamai ok. 3,1 km — odległości z materiałów dewelopera.",
      },
      { title: "Około 12 miesięcy budowy", text: "Płatności etapowe powiązane z postępem prac." },
    ],
    keyFacts: [
      { label: "Lokalizacja", value: "Lamai, Koh Samui" },
      { label: "Warianty", value: "1 lub 2 sypialnie" },
      { label: "Powierzchnia", value: "ok. 65 lub 84 m² wnętrz + taras" },
      { label: "Forma zakupu", value: "Leasehold 30 lat" },
      { label: "Budowa", value: "ok. 12 miesięcy" },
    ],
    features: ["Prywatny basen", "Zadaszony taras", "Kuchnia z barem śniadaniowym", "Miejsce parkingowe", "Styl balijski"],
    standard: {
      included: ["Salon", "Wyposażona kuchnia z barem śniadaniowym", "Prywatny basen", "Duży taras", "Miejsce parkingowe"],
      note: "Przed zakupem potwierdzamy dostępność, zakres wyposażenia, opłaty rejestracyjne i podatki oraz warunki przeniesienia praw.",
    },
    costs: [
      {
        label: "Czynsz za grunt",
        value: "60 000 THB rocznie (ok. 6 984 PLN), płatny co 5 lat. Pierwsza płatność: 300 000 THB (ok. 34 920 PLN). Wzrost czynszu o 5% co 5 lat.",
      },
      { label: "Rezerwacja / umowa", value: "10% — dla najtańszej willi 480 000 THB (ok. 55 872 PLN)" },
    ],
    payment: {
      stages: [
        { label: "Rezerwacja / podpisanie umowy", percent: 10 },
        { label: "Rejestracja i start budowy", percent: 30 },
        { label: "Fundamenty", percent: 20 },
        { label: "Dach / strop", percent: 20 },
        { label: "Wnętrza", percent: 17 },
        { label: "Przekazanie", percent: 3 },
      ],
      notes: ["Dla najtańszej willi rezerwacja wynosi 480 000 THB (ok. 55 872 PLN)."],
    },
    completion: "Około 12 miesięcy budowy; płatności etapowe.",
    neighbourhoodTitle: "Plaża i wygoda na co dzień w Lamai",
    neighbourhood: [
      {
        title: "Plaża na spacery i kąpiele",
        text: "Długi piaszczysty brzeg, restauracje przy morzu i spokojniejsza atmosfera niż w Chaweng. Silver Beach to pobliska, mniejsza zatoka wśród granitowych skał.",
      },
      {
        title: "Trzy pomysły na wieczór",
        text: "Lamai Night Market, niedzielna Walking Street i Lamai Night Plaza: tajskie jedzenie, pamiątki i spacer po centrum.",
      },
      {
        title: "Szkoły i zakupy",
        text: "Windfield International School oraz Lamai International School; Lotus’s, Makro i lokalny targ ze świeżymi owocami i warzywami.",
      },
      {
        title: "Aktywny wypoczynek i relaks",
        text: "Treningi Muay Thai w Punch it i Lamai Muay Thai, siłownie, salony masażu oraz beach cluby, np. Zephyr.",
      },
      {
        title: "Atrakcje na krótkie wypady",
        text: "Skały Hin Ta i Hin Yai, Wat Lamai oraz Lamai Viewpoint z widokiem na wybrzeże.",
      },
    ],
    images: [
      { key: "lamai-bali-villas/villa-pool", alt: "Parterowa willa w stylu balijskim z pergolą, basenem i leżakami", caption: "Willa z basenem i pergolą" },
      { key: "lamai-bali-villas/garden-pool", alt: "Basen w tropikalnym ogrodzie z leżakami przy willi", caption: "Ogród z basenem" },
      { key: "lamai-bali-villas/covered-terrace", alt: "Zadaszony taras z wypoczynkiem i kuchnią z barem śniadaniowym", caption: "Zadaszony taras i kuchnia" },
      { key: "lamai-bali-villas/bedroom", alt: "Sypialnia z drewnianymi meblami i wyjściem na basen", caption: "Sypialnia" },
      { key: "lamai-bali-villas/living-room", alt: "Salon pod skośnym dachem ze świetlikiem i drewnianymi oknami", caption: "Salon" },
      { key: "lamai-bali-villas/bathroom", alt: "Łazienka z podwójną umywalką na drewnianym blacie", caption: "Łazienka" },
    ],
    heroImage: "lamai-bali-villas/villa-pool",
    cardImage: "lamai-bali-villas/villa-pool",
    exchangeNote: "Kwoty w PLN są orientacyjne. Przyjęto 1 THB = 0,1164 PLN.",
    disclaimer: contactDisclaimer,
    floorPlans: "on-request",
    toConfirm: [
      "Dostępność poszczególnych willi i liczba willi w każdym wariancie",
      "Zakres wyposażenia, opłaty rejestracyjne i podatki",
    ],
    sourcePdf: "Projekt_304_Maenam_1-2bdr_od_559tys.pdf",
    internalNotes: [
      "Nazwa pliku PDF wskazuje Maenam, a treść prezentacji (tytuł, lokalizacja, link do mapy, opis okolicy) — Lamai. Strona pokazuje Lamai; potwierdź z deweloperem.",
    ],
  },
];

export const projects: Project[] = [...baseProjects, ...newOffers];

/** Shown first on the home page and in "Polecane"; the rest follow in random order on the home page. */
export const featuredSlugs = ["maenam-pool-villas", "lamai-bali-villas"];

/** Featured first, then the rest in database order. */
export const projectsFeaturedFirst: Project[] = [
  ...featuredSlugs.map((s) => projects.find((p) => p.slug === s)!),
  ...projects.filter((p) => !featuredSlugs.includes(p.slug)),
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Other projects: same area first, then featured order. */
export function getOtherProjects(slug: string, limit = 3) {
  const self = getProject(slug);
  const others = projectsFeaturedFirst.filter((p) => p.slug !== slug);
  const same = others.filter((p) => p.location.area === self?.location.area);
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, limit);
}

/** Display order on listings: featured first. */
export const projectsByNumber = projectsFeaturedFirst;
