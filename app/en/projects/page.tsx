import { staticMeta } from "@/i18n/pages";
import { ProjectsView } from "@/views/ProjectsView";

export const metadata = staticMeta("en", "projects");

export default function Page() {
  return <ProjectsView lang="en" />;
}
