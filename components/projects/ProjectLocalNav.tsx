"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { prefillEnquiry } from "../forms/prefill";

/** Product-style sub-navigation: project name, section links, and the enquiry button. Sticks under the global bar. */
export function ProjectLocalNav({
  name,
  slug,
  sections,
}: {
  name: string;
  slug: string;
  sections: { id: string; label: string }[];
}) {
  const t = useT();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-14 z-30 border-b border-ink/[0.07] bg-shell/80 backdrop-blur-xl backdrop-saturate-150 md:top-16">
      <div className="container-site flex h-12 items-center gap-6">
        <p className="shrink-0 text-[1.0625rem] font-[600] tracking-[-0.02em]">{name}</p>
        <nav aria-label={t.project.sectionsNav} className="no-scrollbar ml-auto hidden min-w-0 overflow-x-auto md:block">
          <ul className="flex items-center gap-5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cn("text-[0.8125rem] whitespace-nowrap transition-colors", active === s.id ? "text-ink" : "text-ink/60 hover:text-ink")}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => prefillEnquiry({ intent: "info", project: slug })}
          className="ml-auto h-8 shrink-0 rounded-full bg-[var(--p-deep)] px-4 text-[0.8125rem] font-[540] text-white transition-[filter] hover:brightness-110 md:ml-0"
        >
          {t.cta.ask}
        </button>
      </div>
    </div>
  );
}
