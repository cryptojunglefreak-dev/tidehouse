import { staticMeta } from "@/i18n/pages";
import { BuyingView } from "@/views/BuyingView";

export const metadata = staticMeta("de", "buying");

export default function Page() {
  return <BuyingView lang="de" />;
}
