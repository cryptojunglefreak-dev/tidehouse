import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { getProjectsFeaturedFirst } from "@/content";
import { getDictionary, href, type Locale } from "@/i18n";
import { siteConfig, whatsappLink } from "@/config/site";
import { formatThbShort } from "@/lib/format";
import { areaCounts } from "@/lib/summary";
import { areas } from "@/content/pl/areas";

const areaSlug = (name: string) => areas.find((a) => a.name === name)?.slug ?? "";
import { Logo } from "./Logo";

export function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const projectsByNumber = getProjectsFeaturedFirst(lang);
  const year = new Date().getFullYear();
  const social = Object.entries(siteConfig.social).filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <footer className="bg-ocean text-white">
      <div className="container-site grid gap-12 pt-20 pb-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="light" id="footer" href={href(lang, "home")} homeLabel={t.nav.homeLink} />
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/65">
            {t.footer.about}
          </p>
        </div>

        <nav aria-label={t.footer.byLocation} className="md:col-span-3 md:col-start-6">
          <h2 className="text-[0.8125rem] font-[560] text-white/60">{t.footer.projects}</h2>
          <ul className="mt-4 space-y-3">
            {areaCounts(projectsByNumber.map((p) => ({ area: p.location.area }))).map(({ area, count }) => {
              const from = Math.min(...projectsByNumber.filter((p) => p.location.area === area).map((p) => p.priceFrom.thb));
              return (
                <li key={area}>
                  <Link href={`${href(lang, "locations")}#${areaSlug(area)}`} className="group flex items-center gap-2.5 text-[0.9375rem]">
                    <span className="text-white/85 transition-colors group-hover:text-white">{area}</span>
                    <span className="text-[0.8125rem] text-white/50 tabular">{count}</span>
                    <span className="ml-auto text-[0.8125rem] text-white/60 tabular">{t.common.from} {formatThbShort(from, lang)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-label={t.footer.site} className="md:col-span-2">
          <h2 className="text-[0.8125rem] font-[560] text-white/60">{t.footer.site}</h2>
          <ul className="mt-4 space-y-3 text-[0.9375rem]">
            {mainNav(lang).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/85 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 lg:col-span-2">
          <h2 className="text-[0.8125rem] font-[560] text-white/60">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-3 text-[0.9375rem]">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-white/85 transition-colors hover:text-white">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="text-white/85 tabular transition-colors hover:text-white">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="break-all text-white/85 transition-colors hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            {social.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/85 capitalize transition-colors hover:text-white">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site border-t border-white/10 py-8">
        <p className="max-w-4xl text-xs leading-relaxed text-white/60">
          {t.footer.disclaimer}
        </p>
        <div className="mt-6 flex flex-col gap-3 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <Link href={href(lang, "privacy")} className="transition-colors hover:text-white">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
