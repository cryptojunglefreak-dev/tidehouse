import { getDictionary, href, type Locale } from "@/i18n";

export function mainNav(lang: Locale) {
  const t = getDictionary(lang);
  return [
    { href: href(lang, "projects"), label: t.nav.projects },
    { href: href(lang, "locations"), label: t.nav.locations },
    { href: href(lang, "gallery"), label: t.nav.gallery },
    { href: href(lang, "buying"), label: t.nav.buying },
    { href: href(lang, "contact"), label: t.nav.contact },
  ];
}
