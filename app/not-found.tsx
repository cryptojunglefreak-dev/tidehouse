import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundView } from "@/views/NotFoundView";

export default function NotFound() {
  return (
    <SiteShell lang="pl">
      <NotFoundView lang="pl" />
    </SiteShell>
  );
}
