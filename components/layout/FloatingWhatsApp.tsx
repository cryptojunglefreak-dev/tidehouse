"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/cn";
import { parsePath } from "@/i18n/config";
import { useT } from "@/i18n/LangProvider";
import { useRoutePath } from "@/lib/preview";
import { Icon } from "../ui/Icon";

/**
 * Discreet WhatsApp shortcut. Appears after the first screen; hidden on project pages,
 * where the mobile action bar already carries WhatsApp.
 */
export function FloatingWhatsApp() {
  const pathname = useRoutePath();
  const [visible, setVisible] = useState(false);
  const t = useT();
  const onProjectPage = Boolean(parsePath(pathname)?.slug);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (onProjectPage) return null;

  return (
    <a
      href={whatsappLink(t.common.whatsappHello)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.cta.whatsappUs}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 items-center gap-2 rounded-full bg-paper pr-5 pl-4 text-graphite shadow-[0_10px_30px_-10px_rgba(30,59,52,0.45)] ring-1 ring-stone-300 transition-all duration-500 sm:right-6 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-palm text-paper">
        <Icon name="chat" size={18} strokeWidth={1.4} />
      </span>
      <span className="type-label">WhatsApp</span>
    </a>
  );
}
