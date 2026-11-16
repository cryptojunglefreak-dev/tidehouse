import type { ProjectOverlay } from "../types";
import { deBase } from "./projects-base";
import { deNewA } from "./projects-new-a";
import { deNewB } from "./projects-new-b";

export const deProjects: Record<string, ProjectOverlay> = { ...deBase, ...deNewA, ...deNewB };
