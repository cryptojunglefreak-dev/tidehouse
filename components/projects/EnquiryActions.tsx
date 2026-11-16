"use client";

import { useState } from "react";
import { whatsappLink } from "@/config/site";
import type { EnquiryIntent } from "@/lib/enquiry/validation";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { isPreview } from "@/lib/preview";
import { prefillEnquiry } from "../forms/prefill";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function PrefillButton({
  intent,
  project,
  unit,
  message,
  children,
  variant = "primary",
  className,
  size,
  icon,
}: {
  intent: EnquiryIntent;
  project: string;
  unit?: string;
  message?: string;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentProps<typeof Button>["icon"];
}) {
  return (
    <Button variant={variant} size={size} className={className} icon={icon} onClick={() => prefillEnquiry({ intent, project, unit, message })}>
      {children}
    </Button>
  );
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT();

  if (isPreview) return null;

  async function share() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t.cta.copyLink, url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn("inline-flex h-10 items-center gap-2 text-[0.875rem] font-[520] text-muted transition-colors hover:text-ink", className)}
    >
      <Icon name={copied ? "check" : "share"} size={18} />
      <span aria-live="polite">{copied ? t.cta.copied : t.cta.share}</span>
    </button>
  );
}

/** Sticky bottom bar on phones: price + enquiry + WhatsApp, always within thumb reach. */
export function MobileActionBar({ projectName, slug, priceLabel }: { projectName: string; slug: string; priceLabel: string }) {
  const t = useT();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/[0.07] bg-shell/85 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted">{projectName}</p>
          <p className="truncate text-[0.9375rem] font-medium tabular">
            {t.common.from} {priceLabel}
          </p>
        </div>
        <a
          href={whatsappLink(t.common.interestedIn(projectName))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.whatsapp}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink"
        >
          <Icon name="chat" size={20} />
        </a>
        <Button size="md" variant="theme" className="shrink-0" onClick={() => prefillEnquiry({ intent: "info", project: slug })}>
          {t.cta.ask}
        </Button>
      </div>
    </div>
  );
}
