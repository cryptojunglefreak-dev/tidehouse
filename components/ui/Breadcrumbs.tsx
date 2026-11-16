"use client";

import Link from "next/link";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";

export function Breadcrumbs({ items, className }: { items: { name: string; path?: string }[]; className?: string }) {
  const t = useT();
  return (
    <nav aria-label={t.nav.breadcrumbs} className={cn("text-sm text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-stone-400">
                /
              </span>
            )}
            {item.path ? (
              <Link href={item.path} className="transition-colors hover:text-graphite">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-graphite">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
