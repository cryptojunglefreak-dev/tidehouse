"use client";

import { useMemo, useState } from "react";
import { useLang, useT } from "@/i18n/LangProvider";
import type { Ownership, Unit, UnitView } from "@/types/project";
import { bedroomsLabel, formatArea, formatPlnApprox, formatThb } from "@/lib/format";
import { cn } from "@/lib/cn";
import { prefillEnquiry } from "../forms/prefill";
import { Icon } from "../ui/Icon";

type SortKey = "price" | "area" | "code";

interface Props {
  units: Unit[];
  projectSlug: string;
  priceDate?: string;
  exchangeNote: string;
}

const PAGE = 12;

/** Interactive price list: filter by view and layout, sort, switch freehold/leasehold, ask about a unit. */
export function UnitPriceList({ units, projectSlug, priceDate, exchangeNote }: Props) {
  const lang = useLang();
  const t = useT().units;
  const viewLabels = t.views as Record<UnitView, string>;
  const layoutLabel = (l: string) => t.layouts[l] ?? l;
  const all = useT();
  const cta = all.cta;
  const useTAsk = all.cta.ask;
  const showAllShort = all.common.all;
  const [view, setView] = useState<UnitView | "all">("all");
  const [layout, setLayout] = useState<number | "all">("all");
  const [ownership, setOwnership] = useState<Ownership>("leasehold");
  const [sort, setSort] = useState<SortKey>("price");
  const [expanded, setExpanded] = useState(false);

  const views = (["sea", "garden", "pool", "lake", "none"] as UnitView[]).filter((v) => units.some((u) => u.view === v));
  const layouts = Array.from(new Set(units.map((u) => u.bedrooms))).sort();

  const filtered = useMemo(() => {
    const list = units.filter((u) => (view === "all" || u.view === view) && (layout === "all" || u.bedrooms === layout));
    return [...list].sort((a, b) => {
      if (sort === "area") return a.area - b.area;
      if (sort === "code") return a.code.localeCompare(b.code);
      return a[ownership].thb - b[ownership].thb || a.code.localeCompare(b.code);
    });
  }, [units, view, layout, sort, ownership]);

  const shown = expanded ? filtered : filtered.slice(0, PAGE);
  const chip = (active: boolean) =>
    cn(
      "type-label h-10 shrink-0 rounded-full border px-4 transition-colors",
      active ? "border-graphite bg-graphite text-paper" : "border-stone-300 text-muted hover:border-graphite hover:text-graphite",
    );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] lg:mx-0 lg:px-0">
          <div className="flex w-max gap-2" role="group" aria-label={t.view}>
            <button type="button" className={chip(view === "all")} aria-pressed={view === "all"} onClick={() => setView("all")}>
              {t.all} ({units.length})
            </button>
            {views.map((v) => (
              <button key={v} type="button" className={chip(view === v)} aria-pressed={view === v} onClick={() => setView(v)}>
                {viewLabels[v]} ({units.filter((u) => u.view === v).length})
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            {t.layout}
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="h-10 cursor-pointer rounded-full border border-stone-300 bg-transparent px-3 text-graphite"
            >
              <option value="all">{t.all}</option>
              {layouts.map((l) => (
                <option key={l} value={l}>
                  {bedroomsLabel(l, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            {t.sortBy}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 cursor-pointer rounded-full border border-stone-300 bg-transparent px-3 text-graphite"
            >
              <option value="price">{t.sortPrice}</option>
              <option value="area">{t.sortArea}</option>
              <option value="code">{t.sortCode}</option>
            </select>
          </label>
          <div className="flex items-center gap-1 rounded-full border border-stone-300 p-1" role="group" aria-label={t.ownership}>
            {(["leasehold", "freehold"] as Ownership[]).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={ownership === o}
                onClick={() => setOwnership(o)}
                className={cn(
                  "type-label h-8 rounded-full px-3.5 transition-colors",
                  ownership === o ? "bg-palm text-paper" : "text-muted hover:text-graphite",
                )}
              >
                {o === "leasehold" ? "Leasehold" : "Freehold"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 border-t border-graphite">
        <table className="w-full border-collapse text-left text-[0.9375rem] tabular">
          <caption className="sr-only">
            {t.caption(ownership, filtered.length)}
          </caption>
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-stone-300 text-sm text-muted">
              <th scope="col" className="py-3 pr-4 font-normal">
                {t.unit}
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                {t.floor}
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                {t.layout}
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                {t.viewCol}
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-normal">
                {t.areaShort}
              </th>
              <th scope="col" className="py-3 pr-4 text-right font-normal">
                {ownership === "leasehold" ? "Leasehold" : "Freehold"}
              </th>
              <th scope="col" className="py-3 font-normal">
                <span className="sr-only">{t.price}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u.code} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-stone-300 py-4 sm:table-row sm:py-0">
                <th scope="row" className="font-medium sm:py-3.5 sm:pr-4">
                  {u.code}
                  <span className="block text-sm font-normal text-muted sm:hidden">
                    {layoutLabel(u.layout)}, {formatArea(u.area, lang)}, {t.floorN(u.floor)}, {viewLabels[u.view].toLowerCase()}
                  </span>
                </th>
                <td className="hidden sm:table-cell sm:py-3.5 sm:pr-4">{u.floor}</td>
                <td className="hidden sm:table-cell sm:py-3.5 sm:pr-4">{layoutLabel(u.layout)}</td>
                <td className="hidden text-muted sm:table-cell sm:py-3.5 sm:pr-4">{viewLabels[u.view]}</td>
                <td className="hidden text-right sm:table-cell sm:py-3.5 sm:pr-4">{formatArea(u.area, lang)}</td>
                <td className="row-span-2 text-right sm:py-3.5 sm:pr-4">
                  <span className="block">{formatThb(u[ownership].thb, lang)}</span>
                  {lang === "pl" && <span className="block text-sm text-muted">{formatPlnApprox(u[ownership].pln, lang)}</span>}
                </td>
                <td className="sm:py-3.5 sm:text-right">
                  <button
                    type="button"
                    onClick={() => prefillEnquiry({ intent: "info", project: projectSlug, unit: u.code, message: t.unitMessage(u.code) })}
                    className="type-label mt-2 inline-flex items-center gap-1.5 text-palm underline decoration-palm/30 underline-offset-4 hover:decoration-palm sm:mt-0"
                    aria-label={t.askUnit(u.code)}
                  >
                    {useTAsk}
                    <Icon name="arrowRight" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-muted">
            {t.empty}{" "}
            <button type="button" className="text-graphite underline underline-offset-4" onClick={() => (setView("all"), setLayout("all"))}>
              {showAllShort}
            </button>
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {priceDate && t.priceDate(priceDate)}
          {exchangeNote.replace(/^Ceny i dostępność: [\d.]+\. /, "")}
        </p>
        {filtered.length > PAGE && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="type-label inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-graphite/25 px-5 hover:border-graphite"
          >
            {expanded ? cta.showLess : cta.showAll(filtered.length)}
            <Icon name={expanded ? "minus" : "plus"} size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
