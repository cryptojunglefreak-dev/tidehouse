import Image from "next/image";
import Link from "next/link";
import { getAreas, getProjectsFeaturedFirst } from "@/content";
import { getDictionary, href, projectHref, type Locale } from "@/i18n";
import type { ImageKey } from "@/content/images.generated";
import { getImage } from "@/lib/images";
import { ButtonLink } from "../ui/Button";
import { VisualTag } from "../ui/VisualTag";

const areaImage: Record<string, ImageKey> = {
  bangrak: "bangrak-beach-apartments/aerial-beach",
  maenam: "maenam-pool-villas/terrace",
  lamai: "lamai-rooftop-villa/villa-garden",
  chaweng: "chaweng-lake-villas/lake-pool",
  bophut: "bophut-hills-villas/aerial",
  "plai-laem": "plai-laem-pool-villas/aerial",
  "thong-krut": "thong-krut-bay-villas/pool-courtyard",
};
const MAX_CHIPS = 3;

export function AreasSection({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const areas = getAreas(lang);
  const projectsByNumber = getProjectsFeaturedFirst(lang);
  return (
    <section aria-labelledby="okolice-tytul" className="bg-ocean text-white">
      <div className="container-site py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="okolice-tytul" className="type-display text-[clamp(2.1rem,1.4rem+2.6vw,3.75rem)]">
            {t.home.areasTitle}
          </h2>
          <p className="type-lead mt-5 text-white/70">{t.home.areasIntro}</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {areas.map((area) => {
            const inArea = projectsByNumber.filter((p) => p.location.area === area.name);
            const img = getImage(areaImage[area.slug] ?? inArea[0]?.cardImage ?? "lamai-rooftop-villa/villa-garden");
            return (
              <article key={area.slug} className="flex flex-col overflow-hidden rounded-[var(--radius-tile)] bg-white/[0.06] ring-1 ring-white/10">
                <div className="relative aspect-[16/10]">
                  <Image src={img.src} alt="" fill sizes="(min-width:768px) 33vw, 100vw" placeholder="blur" blurDataURL={img.blurDataURL} className="object-cover" />
                  <VisualTag />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-sm text-sun">
                    {area.island}, {area.coast.toLowerCase()}
                  </p>
                  <h3 className="type-heading mt-1 text-[1.75rem]">{area.name}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-white/75">{area.lead}</p>
                  <ul className="mt-5 space-y-2 text-[0.9375rem] text-white/70">
                    {area.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun/80" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                    {inArea.slice(0, MAX_CHIPS).map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={projectHref(lang, p.slug)}
                          className="inline-flex h-9 items-center gap-2 rounded-full bg-white/10 px-3.5 text-[0.8125rem] font-[520] transition-colors hover:bg-white hover:text-ink"
                        >
                          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: p.theme.accent }} />
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  {inArea.length > MAX_CHIPS && (
                      <li>
                        <Link
                          href={href(lang, "projects")}
                          className="inline-flex h-9 items-center rounded-full px-3.5 text-[0.8125rem] font-[520] text-sun underline-offset-4 hover:underline"
                        >
                          {t.common.more(inArea.length - MAX_CHIPS)}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink href={href(lang, "locations")} variant="outline-light">
            {t.cta.moreLocations}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
