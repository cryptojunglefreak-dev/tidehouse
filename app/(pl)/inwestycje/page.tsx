import { staticMeta } from "@/i18n/pages";
import { ProjectsView } from "@/views/ProjectsView";

export const metadata = staticMeta("pl", "projects");

export default function Page() {
  return <ProjectsView lang="pl" />;
}
