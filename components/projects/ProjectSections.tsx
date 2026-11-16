import type { Project, UnitType } from "@/types/project";
import { formatPlnApprox, formatThb } from "@/lib/format";
import { getDictionary, type Locale } from "@/i18n";
import { cn } from "@/lib/cn";
import { Icon } from "../ui/Icon";
import { PrefillButton } from "./EnquiryActions";

/** Centred section title, product-page style. */
export function SubHeading({
  id,
  children,
  intro,
  className,
  align = "center",
}: {
  id?: string;
  children: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      <h2 id={id} className="type-display scroll-mt-32 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)]">
        {children}
      </h2>
      {intro && <p className={cn("type-lead mt-4 text-muted", align === "center" && "mx-auto max-w-2xl")}>{intro}</p>}
    </div>
  );
}

/** Highlights as a bento of tiles in the project's colour. */
export function Highlights({ project }: { project: Project }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {project.highlights.map((h, i) => (
        <li
          key={h.title}
          className={cn(
            "flex flex-col justify-between gap-8 rounded-[var(--radius-tile)] p-8 sm:p-10",
            i === 0 || i === 3 ? "bg-[var(--p-bg)] text-[var(--p-deep)]" : "bg-paper",
          )}
        >
          <h3 className="type-display text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] text-[var(--p-deep)]">{h.title}</h3>
          <p className={cn("max-w-md text-[1.0625rem] leading-relaxed", i === 0 || i === 3 ? "opacity-80" : "text-muted")}>{h.text}</p>
        </li>
      ))}
    </ul>
  );
}

function PriceBlock({ label, price, lang }: { label: string; price?: UnitType["prices"]["leasehold"]; lang: Locale }) {
  const t = getDictionary(lang);
  if (!price) return null;
  return (
    <div>
      <dt className="text-[0.8125rem] text-muted">{label}</dt>
      <dd className="mt-0.5 tabular">
        <span className="text-[1.25rem] font-[600] tracking-[-0.02em]">
          {price.from && <span className="mr-1 text-[0.875rem] font-normal text-muted">{t.common.from}</span>}
          {formatThb(price.thb, lang)}
        </span>
        {lang === "pl" && <span className="block text-[0.8125rem] text-muted">{formatPlnApprox(price.pln, lang)}</span>}
      </dd>
    </div>
  );
}

/** One card per layout, like model cards on a product page. */
export function UnitTypeCards({ project, lang }: { project: Project; lang: Locale }) {
  const d = getDictionary(lang);
  const cols = project.unitTypes.length;
  return (
    <ul
      className={cn(
        "grid gap-3",
        cols === 1 ? "mx-auto max-w-xl" : cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {project.unitTypes.map((t) => (
        <li key={t.id} className="flex flex-col rounded-[var(--radius-tile)] bg-paper p-7 sm:p-8">
          <span aria-hidden="true" className="h-2.5 w-10 rounded-full bg-[var(--p-accent)]" />
          <h3 className="type-display mt-5 text-[2rem] text-[var(--p-deep)]">{t.label}</h3>
          <ul className="mt-3 space-y-1 text-[0.9375rem] text-muted">
            <li>{t.area}</li>
            {t.bathrooms && <li>{t.bathrooms}</li>}
            {t.count && <li>{d.common.houses(t.count)} {d.project.onEstate}</li>}
            {t.note && <li className="text-[var(--p-deep)]">{t.note}</li>}
          </ul>
          <dl className="mt-6 grid gap-4 border-t border-stone-200 pt-5 min-[440px]:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            <PriceBlock lang={lang} label={d.common.leasehold} price={t.prices.leasehold} />
            <PriceBlock lang={lang} label={d.common.freehold} price={t.prices.freehold} />
            <PriceBlock lang={lang} label={project.ownership.length > 1 ? d.common.priceAnyOwnership : d.common.price} price={t.prices.price} />
          </dl>
          <div className="mt-auto pt-7">
            <PrefillButton intent="info" project={project.slug} variant="theme-outline" size="sm" message={d.project.layoutMessage(t.label)}>
              {d.project.askLayout}
            </PrefillButton>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StandardBlock({ project, lang }: { project: Project; lang: Locale }) {
  const t = getDictionary(lang);
  const { standard, features } = project;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-[var(--radius-tile)] bg-paper p-8 sm:p-10">
        <h3 className="type-heading text-[1.25rem]">{t.project.included}</h3>
        <ul className="mt-5 space-y-3">
          {standard.included.map((item) => (
            <li key={item} className="flex gap-3 text-[1.0625rem]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--p-bg)] text-[var(--p-deep)]">
                <Icon name="check" size={15} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        {standard.excluded && (
          <>
            <h3 className="type-heading mt-8 text-[1.25rem]">{t.project.excluded}</h3>
            <ul className="mt-4 space-y-3">
              {standard.excluded.map((item) => (
                <li key={item} className="flex gap-3 text-[1.0625rem]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-muted">
                    <Icon name="minus" size={15} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex flex-col rounded-[var(--radius-tile)] bg-[var(--p-bg)] p-8 text-[var(--p-deep)] sm:p-10">
        <h3 className="type-heading text-[1.25rem]">{t.project.amenities}</h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {features.map((f) => (
            <li key={f} className="rounded-full bg-white/70 px-4 py-2 text-[0.9375rem] font-[500]">
              {f}
            </li>
          ))}
        </ul>
        {standard.note && <p className="mt-auto pt-8 text-[1rem] leading-relaxed opacity-80">{standard.note}</p>}
      </div>
    </div>
  );
}

export function CostsAndPayments({ project, lang }: { project: Project; lang: Locale }) {
  const t = getDictionary(lang);
  const { payment, costs } = project;
  const hasAmounts = payment.stages.some((s) => s.leasehold || s.freehold);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-[var(--radius-tile)] bg-paper p-8 sm:p-10">
        <h3 className="type-heading text-[1.25rem]">{t.project.costsHeading}</h3>
        <dl className="mt-5 divide-y divide-stone-200">
          {costs.map((c) => (
            <div key={c.label} className="py-4 first:pt-0">
              <dt className="text-[0.8125rem] font-[540] text-muted">{c.label}</dt>
              <dd className="mt-1 text-[1.0625rem] leading-snug tabular">{c.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-[var(--radius-tile)] bg-paper p-8 sm:p-10">
        <h3 className="type-heading text-[1.25rem]">{t.project.scheduleHeading}</h3>
        {payment.intro && <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{payment.intro}</p>}
        {payment.stages.length > 0 && (
          <>
            {/* proportional bar of all stages */}
            <div className="mt-6 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
              {payment.stages.map((s, i) => (
                <span
                  key={s.label}
                  style={{ width: `${s.percent}%`, opacity: 1 - i * (0.75 / payment.stages.length) }}
                  className="h-full bg-[var(--p-accent)] first:rounded-l-full last:rounded-r-full [&+span]:ml-0.5"
                />
              ))}
            </div>
            <ol className="mt-5 divide-y divide-stone-200">
              {payment.stages.map((s, i) => (
                <li key={s.label} className="py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="flex items-baseline gap-3 text-[1rem]">
                      <span className="w-4 shrink-0 text-[0.8125rem] text-muted tabular" aria-hidden="true">
                        {i + 1}
                      </span>
                      {s.label}
                    </span>
                    <span className="text-[1.0625rem] font-[600] tabular">{s.percent}%</span>
                  </div>
                  {hasAmounts && (
                    <p className="mt-1 ml-7 text-[0.8125rem] text-muted tabular">
                      {s.leasehold && <>LH {formatThb(s.leasehold.thb, lang)}</>}
                      {s.leasehold && s.freehold && ", "}
                      {s.freehold && <>FH {formatThb(s.freehold.thb, lang)}</>}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
        {payment.notes?.map((n) => (
          <p key={n} className="mt-4 rounded-xl bg-[var(--p-bg)] px-4 py-3 text-[0.9375rem] text-[var(--p-deep)]">
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}

export function Neighbourhood({ project }: { project: Project }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {project.neighbourhood.map((n) => (
        <li key={n.title} className="rounded-[var(--radius-card)] bg-paper p-6 sm:p-7">
          <h3 className="type-heading text-[1.125rem]">{n.title}</h3>
          <p className="mt-2 text-[0.9875rem] leading-relaxed text-muted">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
