/**
 * Offers added in November 2026 (Projekt 312–368). One file per project — to add another,
 * copy a file, add its photos to assets/source/<slug>/, run `npm run images` and list it below.
 */
import type { Project } from "@/types/project";
import { bophutHillsVillas } from "./bophut-hills-villas";
import { chawengLakeVillas } from "./chaweng-lake-villas";
import { lamaiCentralVillas } from "./lamai-central-villas";
import { lamaiFamilyVillas } from "./lamai-family-villas";
import { lamaiGardenVillas } from "./lamai-garden-villas";
import { lamaiLagoonResidences } from "./lamai-lagoon-residences";
import { lamaiPanoramaVillas } from "./lamai-panorama-villas";
import { lamaiParkVillas } from "./lamai-park-villas";
import { lamaiTropicalVillas } from "./lamai-tropical-villas";
import { maenamTrioVillas } from "./maenam-trio-villas";
import { plaiLaemPoolVillas } from "./plai-laem-pool-villas";
import { thongKrutBayVillas } from "./thong-krut-bay-villas";

export const newOffers: Project[] = [
  maenamTrioVillas,
  lamaiGardenVillas,
  chawengLakeVillas,
  bophutHillsVillas,
  thongKrutBayVillas,
  plaiLaemPoolVillas,
  lamaiLagoonResidences,
  lamaiTropicalVillas,
  lamaiPanoramaVillas,
  lamaiParkVillas,
  lamaiFamilyVillas,
  lamaiCentralVillas,
];
