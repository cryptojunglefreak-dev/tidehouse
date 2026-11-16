import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { RevealObserver } from "@/components/ui/RevealObserver";
import type { Locale } from "@/i18n/config";
import { LangProvider } from "@/i18n/LangProvider";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Header, footer and language context around every page of one language version. */
export function SiteShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <LangProvider lang={lang}>
      {lang !== "pl" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />}
      <SiteHeader />
      <main id="tresc" lang={lang}>
        {children}
      </main>
      <SiteFooter lang={lang} />
      <FloatingWhatsApp />
      <RevealObserver />
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(lang)]} />
    </LangProvider>
  );
}
