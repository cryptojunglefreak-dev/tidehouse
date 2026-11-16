"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/images";
import { projectHref } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { Icon } from "../ui/Icon";

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
  /** Show a link to the project page in the caption (used on the main gallery). */
  showProjectLink?: boolean;
}

const MAX_SCALE = 4;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function Lightbox({ items, index, onClose, onChange, showProjectLink }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lang = useLang();
  const d = useT();
  const t = d.gallery;
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ startDist: 0, startScale: 1, lastTap: 0, startX: 0, startY: 0, moved: false });

  const open = index !== null;
  const item = open ? items[index] : null;
  const count = items.length;

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setSwipeX(0);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + count) % count);
    },
    [index, count, onChange],
  );

  // open / close the native modal dialog (focus trap + Escape for free)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => reset(), [index, reset]);

  const clampOffset = useCallback((x: number, y: number, s: number) => {
    const el = stageRef.current;
    if (!el) return { x, y };
    const maxX = ((s - 1) * el.clientWidth) / 2;
    const maxY = ((s - 1) * el.clientHeight) / 2;
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  const zoomTo = useCallback(
    (next: number, origin?: { x: number; y: number }) => {
      const s = clamp(next, 1, MAX_SCALE);
      if (s === 1) {
        setScale(1);
        setOffset({ x: 0, y: 0 });
        return;
      }
      const el = stageRef.current;
      if (origin && el) {
        const rect = el.getBoundingClientRect();
        const px = origin.x - (rect.left + rect.width / 2);
        const py = origin.y - (rect.top + rect.height / 2);
        // keep the point under the cursor in place
        const ratio = s / scale;
        const nx = px - (px - offset.x) * ratio;
        const ny = py - (py - offset.y) * ratio;
        setOffset(clampOffset(nx, ny, s));
      } else {
        setOffset((o) => clampOffset(o.x, o.y, s));
      }
      setScale(s);
    },
    [scale, offset, clampOffset],
  );

  // keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomTo(scale + 0.75);
      else if (e.key === "-") zoomTo(scale - 0.75);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, zoomTo, scale]);

  // wheel zoom (non-passive so the page does not scroll behind)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      zoomTo(scale * factor, { x: e.clientX, y: e.clientY });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, scale, zoomTo]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved = false;
    gesture.current.startX = e.clientX;
    gesture.current.startY = e.clientY;
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      gesture.current.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.startScale = scale;
    }
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (Math.hypot(e.clientX - gesture.current.startX, e.clientY - gesture.current.startY) > 6) gesture.current.moved = true;

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const next = clamp((gesture.current.startScale * dist) / (gesture.current.startDist || dist), 1, MAX_SCALE);
      setScale(next);
      setOffset((o) => clampOffset(o.x, o.y, next));
      return;
    }
    if (scale > 1) {
      setOffset((o) => clampOffset(o.x + (e.clientX - prev.x), o.y + (e.clientY - prev.y), scale));
    } else {
      setSwipeX(e.clientX - gesture.current.startX);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) return;
    setDragging(false);

    if (scale === 1 && Math.abs(swipeX) > 60) {
      go(swipeX < 0 ? 1 : -1);
      setSwipeX(0);
      return;
    }
    setSwipeX(0);

    // double tap / double click toggles zoom
    if (!gesture.current.moved) {
      const now = Date.now();
      if (now - gesture.current.lastTap < 300) {
        zoomTo(scale > 1 ? 1 : 2.5, { x: e.clientX, y: e.clientY });
        gesture.current.lastTap = 0;
      } else {
        gesture.current.lastTap = now;
      }
    }
  };

  const neighbours = open ? [(index + 1) % count, (index - 1 + count) % count] : [];

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.dialog}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-graphite p-0 text-paper backdrop:bg-graphite/90 open:flex open:flex-col"
    >
      {item && (
        <>
          {/* top bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="type-label tabular text-paper/70" aria-live="polite">
              {index! + 1} / {count}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => zoomTo(scale - 0.75)}
                disabled={scale <= 1}
                className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-paper/10 disabled:opacity-35 sm:inline-flex"
                aria-label={t.zoomOut}
              >
                <Icon name="zoomOut" />
              </button>
              <button
                type="button"
                onClick={() => zoomTo(scale + 0.75)}
                disabled={scale >= MAX_SCALE}
                className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-paper/10 disabled:opacity-35 sm:inline-flex"
                aria-label={t.zoomIn}
              >
                <Icon name="zoomIn" />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center gap-2 rounded-full pr-2 pl-4 transition-colors hover:bg-paper/10"
                aria-label={t.close}
              >
                <span className="type-label hidden sm:inline">{t.closeShort}</span>
                <Icon name="close" size={24} />
              </button>
            </div>
          </div>

          {/* stage */}
          <div className="relative min-h-0 flex-1">
            <div
              ref={stageRef}
              className={cn(
                "absolute inset-0 touch-none select-none",
                scale > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
              )}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div
                key={item.key}
                className="absolute inset-0 animate-[lb-in_0.45s_var(--ease-out-soft)] will-change-transform sm:inset-x-16"
                style={{
                  transform: `translate3d(${offset.x + swipeX}px, ${offset.y}px, 0) scale(${scale})`,
                  transition: dragging ? "none" : "transform 0.35s var(--ease-out-soft)",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  quality={85}
                  loading="eager"
                  placeholder="blur"
                  blurDataURL={item.blurDataURL}
                  className="pointer-events-none object-contain"
                  draggable={false}
                />
              </div>
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute top-1/2 left-2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/40 backdrop-blur transition-colors hover:bg-paper hover:text-graphite sm:inline-flex"
                  aria-label={t.prev}
                >
                  <Icon name="arrowLeft" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute top-1/2 right-2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/40 backdrop-blur transition-colors hover:bg-paper hover:text-graphite sm:inline-flex"
                  aria-label={t.next}
                >
                  <Icon name="arrowRight" />
                </button>
              </>
            )}
          </div>

          {/* caption + thumbnails */}
          <div className="relative z-10 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <p className="text-[0.9375rem]">
                {item.caption}
                <span className="text-paper/55">
                  {" "}
                  — {t.rendering}, {item.projectName}, {item.location}
                </span>
              </p>
              {showProjectLink && (
                <Link
                  href={projectHref(lang, item.projectSlug)}
                  className="type-label shrink-0 text-sand-200 underline decoration-sand-200/40 underline-offset-4 hover:decoration-sand-200"
                >
                  {d.cta.seeProject(item.projectName)}
                </Link>
              )}
            </div>
            {count > 1 && (
              <div className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto md:flex" role="list">
                {items.map((thumb, i) => (
                  <button
                    key={thumb.key}
                    type="button"
                    role="listitem"
                    onClick={() => onChange(i)}
                    aria-label={t.photoN(i + 1, thumb.caption)}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden transition-opacity",
                      i === index ? "opacity-100 ring-1 ring-paper" : "opacity-45 hover:opacity-80",
                    )}
                  >
                    <Image src={thumb.src} alt="" fill sizes="96px" loading="eager" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-paper/45 sm:hidden">{t.swipeHint}</p>
          </div>

          {/* preload neighbours */}
          <div className="sr-only" aria-hidden="true">
            {neighbours.map((n) => (
              <Image key={items[n].key} src={items[n].src} alt="" width={items[n].width} height={items[n].height} sizes="100vw" quality={85} loading="eager" />
            ))}
          </div>
        </>
      )}
    </dialog>
  );
}
