"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatPlnApprox, formatThbShort, ownershipLabel } from "@/lib/format";
import { projectHref } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import type { ProjectSummary } from "@/lib/summary";
import { themeStyle } from "@/lib/theme";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { VisualTag } from "../ui/VisualTag";

/** Large product-style tile: the project's own colour, centred name, image at the bottom. */
export function ProjectTile({ project, headingLevel: H = "h3", className }: { project: ProjectSummary; headingLevel?: "h2" | "h3"; className?: string }) {
  const img = project.image;
  const lang = useLang();
  const t = useT();
  const href = projectHref(lang, project.slug);

  return (
    <article
      style={themeStyle(project)}
      className={cn("relative flex flex-col overflow-hidden rounded-[var(--radius-tile)] bg-[var(--p-bg)] text-center text-[var(--p-deep)]", className)}
    >
      <div className="px-6 pt-12 sm:px-10 md:pt-14">
        <p className="text-[0.9375rem] font-[540] text-[var(--p-accent)]">
          {project.kindLabel}, {project.area}
        </p>
        <H className="type-display mt-2 text-[clamp(2rem,1.5rem+1.8vw,3.25rem)]">{project.name}</H>
        <p className="type-lead mx-auto mt-3 max-w-md opacity-85">{project.tagline}</p>
        <p className="mt-3 text-[0.9375rem] tabular opacity-90">
          {t.common.from} {formatThbShort(project.priceFrom.thb, lang)}
          {lang === "pl" && project.priceFrom.pln ? ` (${formatPlnApprox(project.priceFrom.pln, lang)})` : ""}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={href} variant="theme">
            {t.cta.learnMore}
          </ButtonLink>
          <ButtonLink href={`${href}#zapytanie`} variant="theme-outline">
            {t.cta.ask}
          </ButtonLink>
        </div>
      </div>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="img-zoom mt-10 block flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <span className="relative block aspect-[16/10] h-full min-h-[14rem] overflow-hidden rounded-[calc(var(--radius-tile)-0.75rem)]">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={img.blurDataURL}
            className="object-cover"
          />
          <VisualTag />
        </span>
      </Link>
    </article>
  );
}

/** Compact card for listings and "other projects": image on top, details below, whole card clickable. */
export function ProjectCard({ project, className, headingLevel: H = "h3" }: { project: ProjectSummary; className?: string; headingLevel?: "h2" | "h3" }) {
  const img = project.image;
  const lang = useLang();
  const t = useT();
  return (
    <article
      style={themeStyle(project)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-tile)] bg-paper shadow-[0_1px_2px_rgba(15,42,51,0.04),0_12px_40px_-20px_rgba(15,42,51,0.18)] transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(15,42,51,0.04),0_24px_60px_-24px_rgba(15,42,51,0.28)]",
        className,
      )}
    >
      <div className="img-zoom relative aspect-[4/3] overflow-hidden bg-[var(--p-bg)]">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="object-cover"
        />
        <VisualTag />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex items-center gap-2 text-[0.875rem] font-[540] text-[var(--p-accent)]">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--p-accent)]" />
          {project.kindLabel}, {project.area}
        </p>
        <H className="type-heading mt-2 text-[1.5rem]">
          <Link href={projectHref(lang, project.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.name}
          </Link>
        </H>
        <p className="mt-1.5 text-[1rem] text-muted">{project.tagline}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-5 text-[0.8125rem] text-ink/80">
          <li className="rounded-full bg-[var(--p-bg)] px-3 py-1">{project.bedroomsLabel}</li>
          <li className="rounded-full bg-[var(--p-bg)] px-3 py-1">{project.areaLabel}</li>
          <li className="rounded-full bg-[var(--p-bg)] px-3 py-1">{ownershipLabel(project.ownership, lang)}</li>
        </ul>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-stone-200 pt-4">
          <span className="flex flex-col tabular">
            <span className="text-[1.125rem] font-[600] tracking-[-0.02em]">
              {t.common.from} {formatThbShort(project.priceFrom.thb, lang)}
            </span>
            {lang === "pl" && <span className="text-[0.8125rem] text-muted">{formatPlnApprox(project.priceFrom.pln, lang)}</span>}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--p-deep)] text-white transition-transform duration-300 group-hover:translate-x-0.5">
            <Icon name="arrowRight" size={18} />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-tile)] opacity-0 ring-2 ring-tide-bright group-has-[a:focus-visible]:opacity-100" />
    </article>
  );
}
