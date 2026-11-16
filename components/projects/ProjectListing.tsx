"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { areaCounts, type ProjectSummary } from "@/lib/summary";
import { isPreview } from "@/lib/preview";
import { ProjectCard } from "./ProjectTile";

type Filters = {
  kind: "all" | "apartment" | "villa";
  area: "all" | string;
  bedrooms: "all" | string;
  ownership: "all" | "freehold" | "leasehold";
  sort: "price-asc" | "price-desc" | "number";
};

const initial: Filters = { kind: "all", area: "all", bedrooms: "all", ownership: "all", sort: "number" };

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          "h-12 w-full cursor-pointer appearance-none rounded-full border bg-stone-100/70 bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10 pl-4 text-[0.9375rem] transition-colors",
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2323272a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
          value === "all" || value === "number" ? "border-transparent" : "border-tide bg-sky",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Location pills with counts — choosing one shows all projects in that area together. */
export function LocationBar({
  areas,
  total,
  value,
  onChange,
  tone = "light",
}: {
  areas: { area: string; count: number }[];
  total: number;
  value: string;
  onChange: (area: string) => void;
  tone?: "light" | "dark";
}) {
  const t = useT();
  const item = (key: string, label: string, count: number) => {
    const active = value === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        aria-pressed={active}
        className={cn(
          "inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full pr-1.5 pl-4 text-[0.9375rem] font-[540] whitespace-nowrap transition-colors",
          active
            ? "bg-ocean text-white"
            : tone === "light"
              ? "bg-paper text-ink/80 hover:text-ink"
              : "bg-white/10 text-white/85 hover:bg-white/15",
        )}
      >
        {label}
        <span
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.8125rem] tabular",
            active ? "bg-white/15" : tone === "light" ? "bg-stone-100 text-muted" : "bg-white/10",
          )}
        >
          {count}
        </span>
      </button>
    );
  };
  return (
    <div role="group" aria-label={t.listing.location} className="no-scrollbar -mx-[clamp(1.25rem,4vw,2.5rem)] flex snap-x gap-2 overflow-x-auto px-[clamp(1.25rem,4vw,2.5rem)] pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
      {item("all", t.common.all, total)}
      {areas.map((a) => item(a.area, a.area, a.count))}
    </div>
  );
}

/** Filterable listing. Filters are mirrored in the URL so a filtered view can be shared. */
export function ProjectListing({ projects }: { projects: ProjectSummary[] }) {
  const t = useT();
  const [f, setF] = useState<Filters>(initial);

  // read filters from URL once
  useEffect(() => {
    if (isPreview) return;
    const sp = new URLSearchParams(window.location.search);
    setF((prev) => ({
      kind: (sp.get("rodzaj") as Filters["kind"]) ?? prev.kind,
      area: sp.get("lokalizacja") ?? prev.area,
      bedrooms: sp.get("sypialnie") ?? prev.bedrooms,
      ownership: (sp.get("forma") as Filters["ownership"]) ?? prev.ownership,
      sort: (sp.get("sortuj") as Filters["sort"]) ?? prev.sort,
    }));
  }, []);

  useEffect(() => {
    if (isPreview) return;
    const sp = new URLSearchParams();
    if (f.kind !== "all") sp.set("rodzaj", f.kind);
    if (f.area !== "all") sp.set("lokalizacja", f.area);
    if (f.bedrooms !== "all") sp.set("sypialnie", f.bedrooms);
    if (f.ownership !== "all") sp.set("forma", f.ownership);
    if (f.sort !== "number") sp.set("sortuj", f.sort);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [f]);

  const areas = areaCounts(projects);
  const set = <K extends keyof Filters>(k: K) => (v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const result = useMemo(() => {
    const list = projects.filter((p) => {
      if (f.kind !== "all" && p.kind !== f.kind) return false;
      if (f.area !== "all" && p.area !== f.area) return false;
      if (f.bedrooms !== "all" && !p.bedrooms.some((b) => String(b) === f.bedrooms)) return false;
      if (f.ownership !== "all" && !p.ownership.includes(f.ownership)) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (f.sort === "price-asc") return a.priceFrom.thb - b.priceFrom.thb;
      if (f.sort === "price-desc") return b.priceFrom.thb - a.priceFrom.thb;
      return projects.indexOf(a) - projects.indexOf(b);
    });
  }, [projects, f]);

  // All areas, recommended order: one section per area, the biggest first.
  const grouped = f.area === "all" && f.sort === "number" && areas.length > 1;

  const active = JSON.stringify({ ...f, sort: "number" }) !== JSON.stringify({ ...initial });

  return (
    <div>
      <LocationBar areas={areas} total={projects.length} value={f.area} onChange={set("area")} />

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 rounded-[var(--radius-tile)] bg-paper p-5 sm:p-6 md:grid-cols-4">
        <Select
          label={t.listing.kind}
          value={f.kind}
          onChange={set("kind")}
          options={[
            { value: "all", label: t.listing.kindAll },
            { value: "villa", label: t.listing.villas },
            { value: "apartment", label: t.listing.apartments },
          ]}
        />
        <Select
          label={t.listing.bedrooms}
          value={f.bedrooms}
          onChange={set("bedrooms")}
          options={[
            { value: "all", label: t.listing.any },
            { value: "0", label: t.listing.studio },
            ...[1, 2, 3, 4].map((n) => ({ value: String(n), label: t.listing.bedroomsN(n) })),
          ]}
        />
        <Select
          label={t.listing.ownership}
          value={f.ownership}
          onChange={set("ownership")}
          options={[
            { value: "all", label: t.listing.anyOwnership },
            { value: "freehold", label: "Freehold" },
            { value: "leasehold", label: "Leasehold" },
          ]}
        />
        <div>
          <Select
            label={t.listing.sort}
            value={f.sort}
            onChange={set("sort")}
            options={[
              { value: "number", label: t.listing.recommended },
              { value: "price-asc", label: t.listing.priceAsc },
              { value: "price-desc", label: t.listing.priceDesc },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4" aria-live="polite">
        <p className="text-[0.9375rem] text-muted">
          {t.common.investments(result.length)}
        </p>
        {active && (
          <button type="button" onClick={() => setF(initial)} className="type-label text-graphite underline underline-offset-4">
            {t.listing.clear}
          </button>
        )}
      </div>

      {result.length > 0 && grouped ? (
        <div className="mt-8 space-y-16">
          {areaCounts(result).map(({ area, count }) => (
            <section key={area} aria-labelledby={`obszar-${area}`}>
              <div className="flex items-baseline justify-between gap-4 border-b border-stone-200 pb-4">
                <h2 id={`obszar-${area}`} className="type-heading text-[clamp(1.5rem,1.2rem+1vw,2rem)]">
                  {area}
                </h2>
                <button type="button" onClick={() => set("area")(area)} className="text-[0.9375rem] text-muted hover:text-ink">
                  {t.common.investments(count)}
                </button>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {result
                  .filter((p) => p.area === area)
                  .map((p) => (
                    <ProjectCard key={p.slug} project={p} headingLevel="h3" />
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : result.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.map((p) => (
            <ProjectCard key={p.slug} project={p} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[var(--radius-tile)] bg-paper p-10">
          <p className="type-heading text-xl">{t.listing.none}</p>
          <p className="mt-2 text-muted">{t.listing.noneHint}</p>
          <button type="button" onClick={() => setF(initial)} className="type-label mt-6 text-graphite underline underline-offset-4">
            {t.listing.clear}
          </button>
        </div>
      )}
    </div>
  );
}
