"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ImageData } from "@/lib/images";
import { cn } from "@/lib/cn";
import { Icon } from "../ui/Icon";
import { VisualTag } from "../ui/VisualTag";
import { AgentChat } from "../agent/AgentChat";
import { getDictionary, href, projectHref, type Locale } from "@/i18n";

export interface ShowcaseItem {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  area: string;
  priceFrom: string;
  color: string;
  image: ImageData & { alt: string };
}

const INTERVAL = 6000;
/** Projects in the hero rotation: the featured ones, then a random pick of the rest. */
const SLOTS = 6;

/**
 * Home hero on a deep-sea gradient. Below the headline, one large visualisation;
 * the colour swatches switch between the four projects (and advance on their own).
 */
export function HeroShowcase({
  items: all,
  areas,
  featuredCount = 2,
  lang,
}: {
  items: ShowcaseItem[];
  areas: string[];
  featuredCount?: number;
  lang: Locale;
}) {
  const t = getDictionary(lang);
  const [items, setItems] = useState(() => all.slice(0, SLOTS));
  const [active, setActive] = useState(0);

  // featured stay first; the other slots get a random selection once the page has loaded
  useEffect(() => {
    const rest = all.slice(featuredCount);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    setItems([...all.slice(0, featuredCount), ...rest].slice(0, SLOTS));
  }, [all, featuredCount]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", on);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setTimeout(() => {
      setActive((a) => (a + 1) % items.length);
      setCycle((c) => c + 1);
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, items.length, cycle]);

  const select = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  const current = items[active];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#167f90_0%,#0e4f5f_38%,#0b3240_70%)] pt-28 pb-14 text-white md:pt-36 md:pb-20"
    >
      {/* soft sun glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(246_215_164/0.16),transparent)]"
      />

      <div className="container-site relative text-center">
        <h1 id="hero-title" className="type-display mx-auto max-w-4xl text-[clamp(2.75rem,1.4rem+5.2vw,6rem)]">
          {t.home.heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-[clamp(1.375rem,1rem+1.3vw,2rem)] leading-snug font-[460] tracking-[-0.02em] text-white/85">
          {t.home.heroSubtitle}
        </p>
        <div className="mt-9 md:mt-11">
          <AgentChat areas={areas} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9375rem] font-[520]">
          <Link href={href(lang, "projects")} className="group inline-flex items-center gap-1.5 text-white/85 hover:text-white">
            {t.cta.allProjects}
            <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href={href(lang, "contact")} className="group inline-flex items-center gap-1.5 text-white/85 hover:text-white">
            {t.cta.talk}
            <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div
        className="container-wide relative mt-14 md:mt-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative mx-auto aspect-[4/3] max-w-[92rem] overflow-hidden rounded-[var(--radius-tile)] bg-ocean-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] sm:aspect-[16/9] lg:aspect-[2/1]">
          {items.map((item, i) => (
            <div
              key={item.slug}
              aria-hidden={i !== active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-out-soft)]",
                i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            >
              <Image
                src={item.image.src}
                alt={i === active ? item.image.alt : ""}
                fill
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                sizes="(min-width:1500px) 1480px, 100vw"
                quality={85}
                placeholder="blur"
                blurDataURL={item.image.blurDataURL}
                className="object-cover"
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <VisualTag className="top-4 right-4 sm:top-5 sm:right-5" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 text-left sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div key={current.slug} className="animate-[menu-in_0.6s_var(--ease-out-soft)_both]">
              <p className="text-sm text-white/75">{current.area}</p>
              <p className="type-heading mt-1 text-[clamp(1.4rem,1.1rem+1.2vw,2.25rem)]">{current.name}</p>
              <p className="mt-1 max-w-md text-[0.9375rem] text-white/80">{current.tagline}</p>
            </div>
            <Link
              href={projectHref(lang, current.slug)}
              className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white/15 px-5 text-[0.9375rem] font-[520] backdrop-blur-md transition-colors hover:bg-white/25"
            >
              {t.common.from} {current.priceFrom}
              <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Swatches */}
        <div className="mt-7 flex justify-center">
          <ul aria-label={t.home.chooseProject} className="flex items-center justify-center gap-0.5 rounded-full bg-white/[0.07] p-1 backdrop-blur sm:gap-1 sm:p-1.5">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    onFocus={() => select(i)}
                    aria-pressed={isActive}
                    className={cn(
                      "relative flex h-10 items-center gap-1.5 overflow-hidden rounded-full px-3 text-[0.8125rem] font-[520] transition-colors sm:gap-2 sm:px-4 sm:text-[0.875rem]",
                      isActive ? "bg-white text-ink" : "text-white/75 hover:text-white",
                    )}
                  >
                    <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 ring-white/70" style={{ background: item.color }} />
                    <span className="hidden lg:inline">{item.name}</span>
                    <span className="hidden sm:inline lg:hidden">{item.shortName}</span>
                    <span className="sr-only sm:hidden">{item.name}</span>
                    {isActive && !paused && !reduced && (
                      <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full bg-ink/10">
                        <span
                          key={`${active}-${cycle}`}
                          className="block h-full origin-left animate-[hero-progress_linear_forwards] rounded-full bg-ink/50"
                          style={{ animationDuration: `${INTERVAL}ms` }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
