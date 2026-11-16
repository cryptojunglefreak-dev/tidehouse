import { ProjectPage, projectMeta, projectParams } from "@/i18n/pages";

export const generateStaticParams = projectParams;
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return projectMeta("pl", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectPage lang="pl" slug={(await params).slug} />;
}
