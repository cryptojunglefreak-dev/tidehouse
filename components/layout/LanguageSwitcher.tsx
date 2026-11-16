"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { localeNames, locales, translatePath, type Locale } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { useRoutePath } from "@/lib/preview";
import { Icon } from "../ui/Icon";

const codes: Record<Locale, string> = { pl: "PL", en: "EN", de: "DE" };

/** Compact language menu for the header: current code, opens a small list with native names. */
export function LanguageSwitcher({ onDark }: { onDark?: boolean }) {
  const lang = useLang();
  const t = useT();
  const path = useRoutePath();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [path]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.nav.chooseLanguage}: ${localeNames[lang]}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-[600] tracking-[0.02em] transition-colors",
          onDark ? "text-white/90 hover:bg-white/10" : "text-ink/80 hover:bg-ink/[0.06]",
        )}
      >
        <Icon name="globe" size={17} />
        {codes[lang]}
        <Icon name="chevronDown" size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={menuId}
          className="absolute top-full right-0 z-50 mt-2 w-44 animate-[menu-in_0.2s_var(--ease-out-soft)_both] overflow-hidden rounded-2xl bg-white p-1.5 text-ink shadow-[0_20px_50px_-20px_rgba(11,50,64,0.45)] ring-1 ring-ink/[0.06]"
        >
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={translatePath(path, l)}
                hrefLang={l}
                lang={l}
                aria-current={l === lang ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-[0.9375rem] transition-colors",
                  l === lang ? "bg-sky font-[600]" : "hover:bg-stone-100",
                )}
              >
                {localeNames[l]}
                <span className="text-[0.75rem] font-[600] text-muted">{codes[l]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Row of languages for the mobile menu. */
export function LanguageRow() {
  const lang = useLang();
  const t = useT();
  const path = useRoutePath();
  return (
    <nav aria-label={t.nav.language} className="flex gap-2">
      {locales.map((l) => (
        <Link
          key={l}
          href={translatePath(path, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={cn(
            "inline-flex h-10 flex-1 items-center justify-center rounded-full text-[0.875rem] font-[560] transition-colors",
            l === lang ? "bg-ocean text-white" : "bg-ink/[0.05] text-ink/80",
          )}
        >
          {localeNames[l]}
        </Link>
      ))}
    </nav>
  );
}
