import { staticMeta } from "@/i18n/pages";
import { PrivacyView } from "@/views/PrivacyView";

export const metadata = staticMeta("de", "privacy");

export default function Page() {
  return <PrivacyView lang="de" />;
}
