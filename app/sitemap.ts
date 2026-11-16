import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getProjects } from "@/content";
import { htmlLang, locales, projectHref, routes, type RouteKey } from "@/i18n/config";
import { getImage } from "@/lib/images";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-16");
  const pages: { key: RouteKey; priority: number }[] = [
    { key: "home", priority: 1 },
    { key: "projects", priority: 0.9 },
    { key: "locations", priority: 0.7 },
    { key: "gallery", priority: 0.6 },
    { key: "buying", priority: 0.7 },
    { key: "contact", priority: 0.6 },
  ];
  const alternates = (path: (l: (typeof locales)[number]) => string) => ({
    languages: Object.fromEntries(locales.map((l) => [htmlLang[l], absoluteUrl(path(l))])),
  });

  return locales.flatMap((lang) => [
    ...pages.map((p) => ({
      url: absoluteUrl(routes[lang][p.key]),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: p.priority,
      alternates: alternates((l) => routes[l][p.key]),
    })),
    ...getProjects(lang).map((p) => ({
      url: absoluteUrl(projectHref(lang, p.slug)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: alternates((l) => projectHref(l, p.slug)),
      images: p.images.map((i) => absoluteUrl(getImage(i.key).src)),
    })),
  ]);
}
