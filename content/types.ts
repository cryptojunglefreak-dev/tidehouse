import type { Area } from "./pl/areas";
import type { FaqItem } from "./pl/faq";

type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/**
 * A translation of one project: only text fields, same shape as the Polish entry.
 * Arrays of objects are merged item by item (so unit types keep their prices), arrays of strings are replaced.
 */
export type ProjectOverlay = DeepPartial<{
  tagline: string;
  theme: { label: string };
  kindLabel: string;
  title: string;
  summary: string;
  intro: string[];
  location: { label: string; proximity: string };
  ownershipNote: string;
  bedroomsLabel: string;
  areaLabel: string;
  totalUnits: { label: string };
  unitTypes: { label: string; bathrooms: string; area: string; note: string }[];
  highlights: { title: string; text: string }[];
  keyFacts: { label: string; value: string }[];
  features: string[];
  standard: { included: string[]; excluded: string[]; note: string };
  costs: { label: string; value: string }[];
  payment: { intro: string; stages: { label: string }[]; notes: string[] };
  completion: string;
  neighbourhoodTitle: string;
  neighbourhood: { title: string; text: string }[];
  images: { alt: string; caption: string }[];
  exchangeNote: string;
  disclaimer: string;
  toConfirm: string[];
  priceDate: string;
}>;

export type AreaOverlay = Partial<Pick<Area, "coast" | "lead" | "points">>;

export interface LocaleContent {
  projects: Record<string, ProjectOverlay>;
  areas: Record<string, AreaOverlay>;
  faq: (freeholdNames: string) => FaqItem[];
  process: { title: string; text: string }[];
  comparison: Record<string, { pool: string; furniture: string; handover: string; size: string }>;
  ownership: Record<string, { freehold: string; leasehold: string; landRent: string }>;
  disclaimer: string;
}
