"use client";

import { useEffect, useRef, useState } from "react";
import { IslandMap } from "@/components/maps/IslandMap";
import { areas } from "@/content/pl/areas";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { isPreview } from "@/lib/preview";
import { Icon } from "../ui/Icon";

interface MapEmbedProps {
  query: string;
  label: string;
  /** Area name — shows the site's own island map with this area highlighted. */
  area?: string;
  accent?: string;
  /** Link from the brochure (opens Google Maps in a new tab). */
  href?: string;
  precision: "area" | "project";
  className?: string;
}

/**
 * Location map. Google Maps loads by itself when the map scrolls into view; until then (and in the
 * offline preview, where Google cannot load) the site's own island map with the area pin is shown.
 */
export function MapEmbed({ query, label, area, accent, href, precision, className }: MapEmbedProps) {
  const text = useT().map;
  const box = useRef<HTMLDivElement>(null);
  const hasIsland = Boolean(area && areas.find((a) => a.name === area)?.coords);
  const [mode, setMode] = useState<"island" | "google">(hasIsland || isPreview ? "island" : "google");
  const [visible, setVisible] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${precision === "area" ? 13 : 14}&output=embed`;
  const external = href ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  // load Google only when the map is about to be seen
  useEffect(() => {
    const el = box.current;
    if (!el || isPreview) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          setMode("google");
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showGoogle = mode === "google" && !isPreview && visible;

  return (
    <div ref={box} className={cn("relative overflow-hidden bg-[#c7e3e9]", className)}>
      {showGoogle ? (
        <iframe
          title={`${text.google}: ${label}`}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : hasIsland ? (
        <div className="absolute inset-0">
          <IslandMap
            pins={areas.filter((a) => a.coords).map((a) => ({ name: a.name }))}
            active={area}
            accent={accent}
            focus
            label={text.label}
            credit={text.credit}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ink/40">
          <Icon name="pin" size={40} />
        </div>
      )}

      {/* controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="pointer-events-auto max-w-sm rounded-2xl bg-white/90 px-4 py-3 shadow-[0_10px_30px_-12px_rgba(11,50,64,0.35)] backdrop-blur">
          <p className="flex items-center gap-2 text-[0.9375rem] font-[600]">
            <Icon name="pin" size={16} className="text-tide" />
            {label}
          </p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{precision === "area" ? text.noteArea : text.noteProject}</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {hasIsland && !isPreview && (
            <div className="flex rounded-full bg-white/90 p-1 shadow-[0_10px_30px_-12px_rgba(11,50,64,0.35)] backdrop-blur">
              {(["island", "google"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => {
                    setVisible(true);
                    setMode(m);
                  }}
                  className={cn(
                    "h-9 rounded-full px-3.5 text-[0.8125rem] font-[560] transition-colors",
                    mode === m ? "bg-ocean text-white" : "text-ink/75 hover:text-ink",
                  )}
                >
                  {m === "island" ? text.island : text.google}
                </button>
              ))}
            </div>
          )}
          <a
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ocean px-4 text-[0.8125rem] font-[560] text-white shadow-[0_10px_30px_-12px_rgba(11,50,64,0.5)] transition-opacity hover:opacity-90"
          >
            {precision === "project" || href ? text.project : text.open}
            <Icon name="arrowUpRight" size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
