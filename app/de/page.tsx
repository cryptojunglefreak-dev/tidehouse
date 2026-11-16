import { homeMeta } from "@/i18n/pages";
import { HomeView } from "@/views/HomeView";

export const metadata = homeMeta("de");

export default function Page() {
  return <HomeView lang="de" />;
}
