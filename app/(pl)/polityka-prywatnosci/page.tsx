import { staticMeta } from "@/i18n/pages";
import { PrivacyView } from "@/views/PrivacyView";

export const metadata = staticMeta("pl", "privacy");

export default function Page() {
  return <PrivacyView lang="pl" />;
}
