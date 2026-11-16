"use client";

import { useLang, useT } from "@/i18n/LangProvider";
import type { Money } from "@/types/project";
import { formatPlnApprox, formatThb, formatThbShort } from "@/lib/format";
import { cn } from "@/lib/cn";

interface PriceProps {
  money: Money;
  from?: boolean;
  short?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}

/** THB is the contract currency; PLN is shown as the approximate value printed in the brochure. */
export function Price({ money, from, short, className, size = "md", tone = "dark" }: PriceProps) {
  const lang = useLang();
  const t = useT();
  const main = short ? formatThbShort(money.thb, lang) : formatThb(money.thb, lang);
  const pln = formatPlnApprox(money.pln, lang);
  return (
    <span className={cn("inline-flex flex-col tabular", className)}>
      <span
        className={cn(
          "type-heading",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]",
        )}
      >
        {from && <span className={cn("mr-1.5 text-[0.6em]", tone === "dark" ? "text-muted" : "text-paper/70")}>{t.common.from}</span>}
        {main}
      </span>
      {pln ? <span className={cn("mt-1 text-sm", tone === "dark" ? "text-muted" : "text-paper/70")}>{pln}</span> : null}
    </span>
  );
}
