"use client";

import { useEffect, useMemo, useState } from "react";
import { LocationBar } from "@/components/projects/ProjectListing";
import { ProjectTile } from "@/components/projects/ProjectTile";
import { ButtonLink } from "@/components/ui/Button";
import { href } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { areaCounts, type ProjectSummary } from "@/lib/summary";

const INITIAL = 6;

/** Fisher–Yates on a copy. */
function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Home page projects: featured first (fixed), the rest in random order after the page loads,
 * so the server HTML stays stable. The location bar shows every project of one area together.
 */
export function HomeProjects({ projects, featured }: { projects: ProjectSummary[]; featured: string[] }) {
  const lang = useLang();
  const t = useT();
  const [order, setOrder] = useState(projects);
  const [area, setArea] = useState("all");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const head = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
    setOrder([...head, ...shuffle(projects.filter((p) => !featured.includes(p.slug)))]);
  }, [projects, featured]);

  const areas = useMemo(() => areaCounts(projects), [projects]);
  const list = area === "all" ? order : order.filter((p) => p.area === area);
  const visible = area === "all" && !expanded ? list.slice(0, INITIAL) : list;

  return (
    <div>
      <div className="container-site flex justify-center">
        <LocationBar areas={areas} total={projects.length} value={area} onChange={(a) => { setArea(a); setExpanded(false); }} />
      </div>
      <div className="container-wide mt-8 grid gap-3 lg:grid-cols-2" aria-live="polite">
        {visible.map((p) => (
          <ProjectTile key={p.slug} project={p} />
        ))}
      </div>
      <div className="container-site mt-10 flex flex-wrap justify-center gap-3">
        {area === "all" && !expanded && list.length > INITIAL && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex h-12 items-center rounded-full bg-ocean px-6 text-[0.9375rem] font-[560] text-white transition-opacity hover:opacity-90"
          >
            {t.cta.showAll(list.length)}
          </button>
        )}
        <ButtonLink href={href(lang, "projects")} variant="secondary">
          {t.cta.searchCompare}
        </ButtonLink>
      </div>
    </div>
  );
}
