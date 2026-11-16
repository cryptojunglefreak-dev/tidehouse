import { homeMeta } from "@/i18n/pages";
import { HomeView } from "@/views/HomeView";

export const metadata = homeMeta("en");

export default function Page() {
  return <HomeView lang="en" />;
}
