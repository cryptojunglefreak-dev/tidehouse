/**
 * Global site settings. Contact data comes from the footer of every PDF brochure.
 * Fields set to `null` were not in the brochures — fill them in when available;
 * the UI hides anything that is empty.
 */
export const siteConfig = {
  name: "Tidehouse",
  /** Current domain from the brochures. Change together with NEXT_PUBLIC_SITE_URL when the Tidehouse domain is ready. */
  domain: "domywtajlandii.pl",
  tagline: "Wille i apartamenty na tajskich wyspach",
  description:
    "Wille z prywatnym basenem i apartamenty na tajskich wyspach, przede wszystkim na Koh Samui. Ceny w THB i PLN, cenniki, koszty i harmonogramy płatności. Freehold i leasehold.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://domywtajlandii.pl").replace(/\/$/, ""),
  locale: "pl_PL",
  contact: {
    email: "info@domywtajlandii.pl",
    phoneDisplay: "+66 98 560 5055",
    phoneHref: "+66985605055",
    /** International number without "+" for wa.me links. */
    whatsapp: "66985605055",
  },
  /** Not provided in the brochures — add profile URLs to show icons in the footer. */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
  },
  /** Legal entity for the privacy policy — not provided in the brochures. */
  legal: {
    companyName: null as string | null,
    address: null as string | null,
    registry: null as string | null,
  },
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
