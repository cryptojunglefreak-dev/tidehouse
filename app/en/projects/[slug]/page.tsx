import { ProjectPage, projectMeta, projectParams } from "@/i18n/pages";

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return projectMeta("en", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectPage lang="en" slug={(await params).slug} />;
}
