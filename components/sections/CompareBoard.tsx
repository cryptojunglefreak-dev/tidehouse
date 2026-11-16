"use client";

import Link from "next/link";
import { useState } from "react";
import { LocationBar } from "@/components/projects/ProjectListing";
import { ButtonLink } from "@/components/ui/Button";
import { projectHref } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { themeStyle } from "@/lib/theme";
import type { ProjectTheme } from "@/types/project";

export interface CompareColumn {
  slug: string;
  name: string;
  kindLabel: string;
  area: string;
  theme: ProjectTheme;
  price: string;
  pln: string;
  values: string[];
}

/** Columns scroll sideways; the location bar narrows them to one area. */
export function CompareBoard({ columns, rows, areas }: { columns: CompareColumn[]; rows: string[]; areas: { area: string; count: number }[] }) {
  const lang = useLang();
  const t = useT();
  const [area, setArea] = useState(areas[0]?.area ?? "all");
  const list = area === "all" ? columns : columns.filter((c) => c.area === area);

  return (
    <div>
      <div className="flex justify-center">
        <LocationBar areas={areas} total={columns.length} value={area} onChange={setArea} />
      </div>
      <div
        className="no-scrollbar -mx-[clamp(1.25rem,4vw,2.5rem)] mt-8 snap-x snap-mandatory overflow-x-auto scroll-px-[clamp(1.25rem,4vw,2.5rem)] px-[clamp(1.25rem,4vw,2.5rem)]"
        role="region"
        aria-label={t.compare.region}
        tabIndex={0}
      >
        <div className="mx-auto grid w-max grid-flow-col auto-cols-[78vw] gap-4 sm:auto-cols-[19rem] lg:gap-5">
          {list.map((p) => (
            <article key={p.slug} style={themeStyle(p)} className="snap-start text-center">
              <div className="rounded-[var(--radius-tile)] bg-[var(--p-bg)] px-5 pt-8 pb-7 text-[var(--p-deep)]">
                <span aria-hidden="true" className="mx-auto block h-7 w-7 rounded-full bg-[var(--p-accent)] ring-4 ring-white/70" />
                <h3 className="type-heading mt-4 flex min-h-[3.4rem] items-center justify-center text-[1.375rem]">
                  <Link href={projectHref(lang, p.slug)} className="hover:underline hover:underline-offset-4">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm opacity-85">{p.kindLabel}</p>
                <p className="mt-4 tabular">
                  <span className="block text-[1.25rem] font-[600] tracking-[-0.02em]">{p.price}</span>
                  {p.pln && <span className="text-[0.8125rem] opacity-85">{p.pln}</span>}
                </p>
                <div className="mt-5 flex justify-center">
                  <ButtonLink href={projectHref(lang, p.slug)} variant="theme" size="sm">
                    {t.cta.learnMore}
                  </ButtonLink>
                </div>
              </div>
              <dl className="mt-2 px-2">
                {rows.map((label, i) => (
                  <div key={label} className="border-b border-stone-300/70 py-4 last:border-0">
                    <dt className="text-[0.75rem] font-[540] text-muted">{label}</dt>
                    <dd className="mt-1 min-h-[2.75rem] text-[0.9375rem] leading-snug">{p.values[i]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
