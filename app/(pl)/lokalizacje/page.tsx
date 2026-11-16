import { staticMeta } from "@/i18n/pages";
import { LocationsView } from "@/views/LocationsView";

export const metadata = staticMeta("pl", "locations");

export default function Page() {
  return <LocationsView lang="pl" />;
}
