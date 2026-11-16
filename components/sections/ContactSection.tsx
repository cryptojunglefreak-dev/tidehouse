import type { CSSProperties, ReactNode } from "react";
import { siteConfig, whatsappLink } from "@/config/site";
import { getProjectsFeaturedFirst } from "@/content";
import { getDictionary, type Locale } from "@/i18n";
import type { EnquiryIntent } from "@/lib/enquiry/validation";
import { cn } from "@/lib/cn";
import { EnquiryForm } from "../forms/EnquiryForm";
import { ENQUIRY_ANCHOR } from "../forms/prefill";
import { Icon } from "../ui/Icon";

interface ContactSectionProps {
  lang: Locale;
  title?: ReactNode;
  intro?: ReactNode;
  defaultProject?: string;
  defaultIntent?: EnquiryIntent;
  whatsappMessage?: string;
  headingLevel?: "h1" | "h2";
  className?: string;
  /** Background colour; defaults to the brand sky. */
  background?: string;
}

export function ContactSection({
  lang,
  title,
  intro,
  defaultProject,
  defaultIntent,
  whatsappMessage,
  headingLevel: H = "h2",
  className,
  background,
}: ContactSectionProps) {
  const t = getDictionary(lang);
  const projectOptions = getProjectsFeaturedFirst(lang).map((p) => ({ slug: p.slug, name: p.name, area: p.location.area, ref: p.ref }));
  const methods = [
    { icon: "chat" as const, label: "WhatsApp", value: siteConfig.contact.phoneDisplay, href: whatsappLink(whatsappMessage ?? t.common.whatsappHello), external: true },
    { icon: "phone" as const, label: t.contact.phone, value: siteConfig.contact.phoneDisplay, href: `tel:${siteConfig.contact.phoneHref}` },
    { icon: "mail" as const, label: t.contact.email, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  ];

  return (
    <section
      id={ENQUIRY_ANCHOR}
      aria-labelledby="kontakt-tytul"
      style={{ background: background ?? "var(--color-sky)" } as CSSProperties}
      className={cn("scroll-mt-24", className)}
    >
      <div className="container-site grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 lg:pt-6">
          <H id="kontakt-tytul" className="type-display text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)]">
            {title ?? t.contact.sectionTitle}
          </H>
          <p className="type-lead mt-5 max-w-md text-ink/70">{intro ?? t.contact.sectionIntro}</p>

          <ul className="mt-10 space-y-3">
            {methods.map((m) => (
              <li key={m.label}>
                <a
                  href={m.href}
                  {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl bg-white/60 p-3 pr-5 transition-colors hover:bg-white"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tide text-white">
                    <Icon name={m.icon} size={19} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[0.8125rem] text-muted">{m.label}</span>
                    <span className="truncate text-[1rem] font-[520] tabular">{m.value}</span>
                  </span>
                  <Icon name="arrowUpRight" size={18} className="ml-auto text-ink/40 transition-colors group-hover:text-ink" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <EnquiryForm projects={projectOptions} defaultProject={defaultProject} defaultIntent={defaultIntent} tone="paper" />
        </div>
      </div>
    </section>
  );
}
