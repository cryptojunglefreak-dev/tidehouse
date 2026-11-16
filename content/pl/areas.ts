import type { AreaName, IslandName } from "@/types/project";

/**
 * Areas with projects on the site. To add one (also on another island): add an entry here
 * with its `island`, and use the same `area` / `island` in the project's `location`.
 * Descriptions are condensed from the neighbourhood pages of the brochures.
 */
export interface Area {
  name: AreaName;
  /** Island or region — the Locations page groups areas by it. */
  island: IslandName;
  slug: string;
  coast: string;
  lead: string;
  points: string[];
  mapQuery: string;
  /** Approximate centre of the area [lat, lon] — a pin on the site's own island map (not a plot location). */
  coords?: [number, number];
}

export const areas: Area[] = [
  {
    name: "Lamai",
    island: "Koh Samui",
    slug: "lamai",
    coast: "Wschodnie wybrzeże",
    lead: "Długa zatoka z głębszą wodą w środkowej części, dwie szkoły międzynarodowe i pełne zaplecze na dłuższy pobyt.",
    points: [
      "Lamai International School i Windfield International School",
      "Lamai Night Market, Night Plaza i niedzielna Walking Street",
      "Lotus’s i Makro na codzienne zakupy",
      "Skały Hin Ta i Hin Yai, Wat Lamai, punkty widokowe",
    ],
    mapQuery: "Lamai, Koh Samui, Thailand",
    coords: [9.465, 100.043],
  },
  {
    name: "Maenam",
    island: "Koh Samui",
    slug: "maenam",
    coast: "Północne wybrzeże",
    lead: "Długa plaża z widokiem na Koh Phangan i spokojniejsza zabudowa niż w Chaweng. Dobre miejsce na wolniejszy rytm dnia.",
    points: [
      "Poranny targ i chińska świątynia Chao Eng Sae",
      "18-dołkowe pole Santiburi Samui Country Club",
      "Santiburi Spa i restauracje przy plaży",
      "Świątynia Wat Na Phra Lan",
    ],
    mapQuery: "Maenam, Koh Samui, Thailand",
    coords: [9.568, 99.99],
  },
  {
    name: "Bophut",
    island: "Koh Samui",
    slug: "bophut",
    coast: "Północne wybrzeże",
    lead: "Zielone wzgórza między Bophut i Maenam. Blisko Fisherman’s Village, plaży Maenam i lotniska.",
    points: [
      "Fisherman’s Village z promenadą i restauracjami",
      "W Beach Club i Chi Beach Club",
      "International School of Samui, Big C, Wattanapat Hospital",
      "Plaża Maenam ok. 7 min, lotnisko ok. 18 min",
    ],
    mapQuery: "Bophut, Koh Samui, Thailand",
    coords: [9.553, 100.024],
  },
  {
    name: "Plai Laem",
    island: "Koh Samui",
    slug: "plai-laem",
    coast: "Północno-wschodni cypel",
    lead: "Spokojne plaże na zachody słońca, osłonięta zatoka Choeng Mon i lotnisko kilka minut drogi.",
    points: [
      "Wat Plai Laem z figurą Guanyin i Big Buddha",
      "Zatoka Choeng Mon do kąpieli",
      "Fisherman’s Village na wieczorne spacery",
      "Lotnisko ok. 10 minut autem",
    ],
    mapQuery: "Plai Laem, Koh Samui, Thailand",
    coords: [9.574, 100.074],
  },
  {
    name: "Chaweng",
    island: "Koh Samui",
    slug: "chaweng",
    coast: "Wschodnie wybrzeże",
    lead: "Najbardziej znana plaża wyspy: biały piasek, długa zatoka i centrum handlowe kilka minut drogi.",
    points: [
      "Plaża Chaweng z drobnym, białym piaskiem",
      "Central Samui — zakupy, restauracje, kawiarnie",
      "Beach club CLUB SEEN",
      "Jezioro Chaweng",
    ],
    mapQuery: "Chaweng, Koh Samui, Thailand",
    coords: [9.527, 100.058],
  },
  {
    name: "Thong Krut",
    island: "Koh Samui",
    slug: "thong-krut",
    coast: "Południowe wybrzeże",
    lead: "Spokojne, rybackie południe wyspy: łodzie na pobliskie wysepki, złota pagoda i widoki na morze.",
    points: [
      "Rejsy na Koh Tan, Koh Madsum i Pig Island",
      "Złota pagoda Laem Sor",
      "Greenacre International School",
      "Plaża Lipa Noi i wodospady Na Muang",
    ],
    mapQuery: "Thong Krut, Koh Samui, Thailand",
    coords: [9.418, 99.952],
  },
  {
    name: "Bangrak",
    island: "Koh Samui",
    slug: "bangrak",
    coast: "Północne wybrzeże",
    lead: "Plaża i beach cluby na północnym wybrzeżu wyspy. Z przystani w Bangrak można wybrać się w stronę Koh Phangan.",
    points: [
      "Beach cluby Chi Samui i The Deck",
      "Fisherman’s Village w Bophut z wieczornym marketem",
      "Big Buddha i Wat Plai Laem",
      "Przystanie z połączeniami na Koh Phangan",
    ],
    mapQuery: "Bang Rak, Koh Samui, Thailand",
    coords: [9.567, 100.057],
  },
];
