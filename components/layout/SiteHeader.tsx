"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/config/navigation";
import { siteConfig, whatsappLink } from "@/config/site";
import { href } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { useRoutePath } from "@/lib/preview";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LanguageRow, LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

/** Global navigation: a thin glass bar, as on product sites. */
export function SiteHeader() {
  const pathname = useRoutePath();
  const lang = useLang();
  const t = useT();
  const nav = mainNav(lang);
  const home = href(lang, "home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const f = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          toggleRef.current?.focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          toggleRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  /** On the home page the bar sits on the dark sea gradient until the page scrolls. */
  const onDark = pathname === home && !scrolled && !open;

  return (
    <>
      <a
        href="#tresc"
        className="sr-only z-[70] rounded-full bg-tide px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.nav.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
          open
            ? "bg-shell"
            : onDark
              ? "bg-transparent"
              : scrolled
                ? "bg-shell/80 shadow-[0_1px_0_0_rgb(15_42_51/0.08)] backdrop-blur-xl backdrop-saturate-150"
                : "bg-shell/60 backdrop-blur-md",
        )}
      >
        <div className="container-site flex h-14 items-center justify-between gap-6 md:h-16">
          <Logo className="relative z-10" tone={onDark ? "light" : "dark"} href={home} homeLabel={t.nav.homeLink} />

          <nav aria-label={t.nav.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[0.875rem] transition-colors",
                      onDark
                        ? "text-white/80 hover:text-white"
                        : isActive(item.href)
                          ? "bg-ink/[0.06] text-ink"
                          : "text-ink/70 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher onDark={onDark} />
            <div className="hidden sm:block">
              <ButtonLink href={href(lang, "contact")} size="sm" variant={onDark ? "light" : "primary"}>
                {t.cta.enquire}
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className={cn(
                "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden",
                onDark ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5",
              )}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-shell pt-14 md:pt-16 lg:hidden"
      >
        <nav aria-label={t.nav.mobileNav} className="container-site flex-1 overflow-y-auto pt-6 pb-6">
          <ul className="flex flex-col">
            {[{ href: home, label: t.nav.home }, ...nav].map((item, i) => (
              <li key={item.href} style={{ animationDelay: `${i * 35}ms` }} className="animate-[menu-in_0.5s_var(--ease-out-soft)_both]">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="type-display block py-2.5 text-[2rem] text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-site pb-4">
          <LanguageRow />
        </div>
        <div className="container-site grid grid-cols-2 gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <ButtonLink href={whatsappLink(t.common.whatsappHello)} icon="chat" size="lg">
            WhatsApp
          </ButtonLink>
          <ButtonLink href={`tel:${siteConfig.contact.phoneHref}`} variant="secondary" icon="phone" size="lg">
            {t.cta.call}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
