"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/images";
import { useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { Icon } from "../ui/Icon";
import { VisualTag } from "../ui/VisualTag";
import { Lightbox } from "./Lightbox";

interface GalleryProps {
  items: GalleryItem[];
  layout?: "editorial" | "masonry";
  showProjectLink?: boolean;
  /** Optional filter by project (main gallery page). */
  filters?: { slug: string; label: string }[];
  className?: string;
}

/**
 * Editorial layout: images in groups of three — one large, two small — alternating sides.
 * A remainder of one image goes full width, two images split the row.
 */
function editorialGroups(items: GalleryItem[]) {
  const groups: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += 3) groups.push(items.slice(i, i + 3));
  return groups;
}

function Tile({
  item,
  onOpen,
  sizes,
  className,
  imgClassName,
  natural,
}: {
  item: GalleryItem;
  onOpen: () => void;
  sizes: string;
  className?: string;
  imgClassName?: string;
  natural?: boolean;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t.gallery.enlarge(item.caption)}
      className={cn("img-zoom group relative block w-full overflow-hidden rounded-[var(--radius-card)] bg-stone-200 text-left", className)}
    >
      {natural ? (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={item.blurDataURL}
          className={cn("h-auto w-full", imgClassName)}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={item.blurDataURL}
          className={cn("object-cover", imgClassName)}
        />
      )}
      <span className="absolute inset-0 bg-graphite/0 transition-colors duration-500 group-hover:bg-graphite/10" />
      <span className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-graphite opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <Icon name="zoomIn" size={18} />
      </span>
      <VisualTag />
    </button>
  );
}

export function Gallery({ items, layout = "editorial", showProjectLink, filters, className }: GalleryProps) {
  const t = useT();
  const [active, setActive] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);

  const visible = useMemo(() => (active === "all" ? items : items.filter((i) => i.projectSlug === active)), [items, active]);

  return (
    <div className={className}>
      {filters && (
        <div className="no-scrollbar -mx-[clamp(1.25rem,4vw,3.5rem)] mb-8 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)]">
          <div className="flex w-max gap-2" role="group" aria-label={t.gallery.filter}>
            {[{ slug: "all", label: `${t.common.all} (${items.length})` }, ...filters].map((f) => (
              <button
                key={f.slug}
                type="button"
                aria-pressed={active === f.slug}
                onClick={() => setActive(f.slug)}
                className={cn(
                  "type-label h-10 rounded-full border px-4 transition-colors",
                  active === f.slug ? "border-ink bg-ink text-white" : "border-transparent bg-paper text-ink/75 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {layout === "masonry" ? (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3">
          {visible.map((item, i) => (
            <div key={item.key} className="break-inside-avoid">
              <Tile item={item} natural onOpen={() => setIndex(i)} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {editorialGroups(visible).map((group, g) => {
            const offset = g * 3;
            if (group.length === 1) {
              return (
                <Tile
                  key={group[0].key}
                  item={group[0]}
                  onOpen={() => setIndex(offset)}
                  sizes="100vw"
                  className="aspect-[3/2] md:aspect-[21/9]"
                />
              );
            }
            if (group.length === 2) {
              return (
                <div key={group[0].key} className="grid grid-cols-2 gap-3">
                  {group.map((item, i) => (
                    <Tile key={item.key} item={item} onOpen={() => setIndex(offset + i)} sizes="50vw" className="aspect-[4/3]" />
                  ))}
                </div>
              );
            }
            const flip = g % 2 === 1;
            return (
              <div key={group[0].key} className="grid grid-cols-2 gap-3 md:grid-cols-12">
                <Tile
                  item={group[0]}
                  onOpen={() => setIndex(offset)}
                  sizes="(min-width:768px) 66vw, 100vw"
                  className={cn(
                    "col-span-2 aspect-[4/3] md:col-span-8 md:row-span-2 md:row-start-1 md:aspect-auto",
                    flip ? "md:col-start-5" : "md:col-start-1",
                  )}
                />
                {group.slice(1).map((item, i) => (
                  <Tile
                    key={item.key}
                    item={item}
                    onOpen={() => setIndex(offset + 1 + i)}
                    sizes="(min-width:768px) 33vw, 50vw"
                    className={cn("aspect-[4/3] md:col-span-4", flip ? "md:col-start-1" : "md:col-start-9")}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      <Lightbox items={visible} index={index} onClose={() => setIndex(null)} onChange={setIndex} showProjectLink={showProjectLink} />
    </div>
  );
}
