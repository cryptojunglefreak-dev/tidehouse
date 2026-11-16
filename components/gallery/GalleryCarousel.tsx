"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/images";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { Icon } from "../ui/Icon";
import { VisualTag } from "../ui/VisualTag";
import { Lightbox } from "./Lightbox";

/**
 * Horizontal strip of large images that drifts slowly in an endless loop
 * (pauses on hover, touch, keyboard focus and while the lightbox is open; off with reduced motion).
 * Swipe on touch, arrows on desktop; clicking an image opens the lightbox.
 */
export function GalleryCarousel({
  items,
  showProjectLink,
  tone = "light",
  className,
}: {
  items: GalleryItem[];
  showProjectLink?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const t = useT().gallery;
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [copies, setCopies] = useState(2);

  // pause reasons: hover, touch, keyboard focus, lightbox, off-screen, hidden tab
  const pause = useRef({ hover: false, touch: false, focus: false, offscreen: true, until: 0 });
  const pos = useRef(0);
  const indexRef = useRef<number | null>(null);
  indexRef.current = index;

  // Slow, endless drift: the strip is rendered twice and jumps back by one set width.
  useEffect(() => {
    const el = track.current;
    if (!el || items.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    setAuto(true);

    const SPEED = 28; // px per second
    let raf = 0;
    let last = performance.now();

    const loopWidth = () => {
      const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
      const first = slides[0];
      const copy = slides[items.length];
      return first && copy ? copy.offsetLeft - first.offsetLeft : 0;
    };

    // enough copies to always fill the screen past the jump point
    const fit = () => {
      const L = loopWidth();
      if (L > 0) setCopies(Math.max(2, Math.ceil(el.clientWidth / L) + 1));
    };
    requestAnimationFrame(fit);
    window.addEventListener("resize", fit);

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const p = pause.current;
      const paused = p.hover || p.touch || p.focus || p.offscreen || indexRef.current !== null || document.hidden || now < p.until;
      const L = loopWidth();
      if (paused) {
        pos.current = el.scrollLeft;
      } else if (L > 0) {
        pos.current += SPEED * dt;
        if (pos.current >= L) pos.current -= L;
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => {
      pause.current.offscreen = !e.isIntersecting;
    });
    io.observe(el);

    // after a manual swipe, keep the position inside the first copy
    const onScrollEnd = () => {
      const L = loopWidth();
      if (L > 0 && el.scrollLeft >= L) el.scrollLeft -= L;
    };
    el.addEventListener("scrollend", onScrollEnd);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      io.disconnect();
      el.removeEventListener("scrollend", onScrollEnd);
    };
  }, [items.length]);

  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);
  useEffect(() => {
    if (auto) return;
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, auto]);

  const holdFor = (ms: number) => {
    pause.current.until = performance.now() + ms;
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
    const first = slides[0];
    const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.8;
    if (auto && dir === -1 && el.scrollLeft < step) {
      // wrap backwards into the second copy before moving left
      const copy = slides[items.length];
      if (copy && first) el.scrollLeft += copy.offsetLeft - first.offsetLeft;
    }
    holdFor(1600);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow = cn(
    "flex h-11 w-11 items-center justify-center rounded-full transition-[opacity,background-color] disabled:opacity-30",
    tone === "light" ? "bg-ink/[0.07] text-ink hover:bg-ink/[0.12]" : "bg-white/15 text-white hover:bg-white/25",
  );

  return (
    <div className={className}>
      <div
        ref={track}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") pause.current.hover = true;
        }}
        onPointerLeave={() => {
          pause.current.hover = false;
        }}
        onTouchStart={() => {
          pause.current.touch = true;
        }}
        onTouchEnd={() => {
          pause.current.touch = false;
          holdFor(2500);
        }}
        onWheel={() => holdFor(2000)}
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) pause.current.focus = true;
        }}
        onBlur={() => {
          pause.current.focus = false;
        }}
        className={cn(
          "no-scrollbar flex gap-4 overflow-x-auto scroll-px-[max(1.25rem,calc((100vw-82rem)/2+2.5rem))] px-[max(1.25rem,calc((100vw-82rem)/2+2.5rem))]",
          !auto && "snap-x snap-mandatory",
        )}
      >
        {(auto ? Array.from({ length: copies }, () => items).flat() : items).map((item, n) => {
          const i = n % items.length;
          const copy = n >= items.length;
          const ratio = item.width / item.height;
          return (
            <button
              key={`${item.key}-${n}`}
              data-slide
              type="button"
              tabIndex={copy ? -1 : undefined}
              aria-hidden={copy || undefined}
              onClick={() => setIndex(i)}
              className="img-zoom group relative shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] bg-stone-200"
              style={{ height: "clamp(16rem, 52vh, 34rem)", aspectRatio: String(Math.min(Math.max(ratio, 1.1), 2.1)) }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width:1024px) 60vw, 85vw"
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-5 pt-10 pb-4 text-left text-[0.9375rem] font-[520] text-white">
                <span className="sr-only">{t.enlarge("")}</span>
                {item.caption}
              </span>
              <VisualTag className="top-3 left-3" />
            </button>
          );
        })}
      </div>

      <div className="container-site mt-6 flex items-center justify-end gap-2">
        <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={!auto && edges.start} aria-label={t.prevMany}>
          <Icon name="arrowLeft" size={20} />
        </button>
        <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={!auto && edges.end} aria-label={t.nextMany}>
          <Icon name="arrowRight" size={20} />
        </button>
      </div>

      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onChange={setIndex} showProjectLink={showProjectLink} />
    </div>
  );
}
