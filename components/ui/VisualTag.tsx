"use client";

import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";

/** Every image on the site is a developer's rendering — say so on the image itself. */
export function VisualTag({ className, label }: { className?: string; label?: string }) {
  const t = useT();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full bg-graphite/45 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-paper backdrop-blur-sm",
        className ?? "bottom-3 left-3",
      )}
    >
      {label ?? t.common.visualisation}
    </span>
  );
}
