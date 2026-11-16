"use client";

import { useEffect } from "react";
import { useRoutePath } from "@/lib/preview";

/**
 * One observer for the whole site: elements with `data-reveal` fade in once when they enter the viewport.
 * Without JavaScript (or with reduced motion) the content is simply visible.
 */
export function RevealObserver() {
  const pathname = useRoutePath();

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    // wait one frame so a freshly rendered view is in the DOM
    const raf = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed='true'])"));
      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => (el.dataset.revealed = "true"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.revealed = "true";
              io.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      els.forEach((el) => io.observe(el));
      observer = io;
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
