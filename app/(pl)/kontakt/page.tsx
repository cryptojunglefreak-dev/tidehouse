import { staticMeta } from "@/i18n/pages";
import { ContactView } from "@/views/ContactView";

export const metadata = staticMeta("pl", "contact");

export default function Page() {
  return <ContactView lang="pl" />;
}
