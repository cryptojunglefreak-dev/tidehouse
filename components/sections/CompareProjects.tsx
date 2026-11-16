import { getComparison, getProjectsFeaturedFirst } from "@/content";
import { getDictionary, type Locale } from "@/i18n";
import { formatPlnApprox, formatThbShort, ownershipLabel } from "@/lib/format";
import { areaCounts } from "@/lib/summary";
import { CompareBoard, type CompareColumn } from "./CompareBoard";

/** "Which one is right for you" — one column per project, same rows, aligned; filter by area. */
export function CompareProjects({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const comparison = getComparison(lang);
  const tbc = t.common.toConfirm;
  const columns: CompareColumn[] = getProjectsFeaturedFirst(lang).map((p) => {
    const c = comparison[p.slug] ?? { pool: tbc, furniture: tbc, handover: tbc, size: tbc };
    return {
      slug: p.slug,
      name: p.name,
      kindLabel: p.kindLabel,
      area: p.location.area,
      theme: p.theme,
      price: `${t.common.from} ${formatThbShort(p.priceFrom.thb, lang)}`,
      pln: formatPlnApprox(p.priceFrom.pln, lang),
      values: [p.location.label, p.bedroomsLabel, p.areaLabel, ownershipLabel(p.ownership, lang), c.pool, c.furniture, c.handover, c.size],
    };
  });
  return <CompareBoard columns={columns} rows={[...t.compare.rows]} areas={areaCounts(columns)} />;
}
