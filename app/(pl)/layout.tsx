import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { layoutMeta } from "@/i18n/pages";

export const metadata: Metadata = layoutMeta("pl");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="pl">{children}</SiteShell>;
}
