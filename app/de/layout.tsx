import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { layoutMeta } from "@/i18n/pages";

export const metadata: Metadata = layoutMeta("de");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="de">{children}</SiteShell>;
}
