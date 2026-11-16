import { staticMeta } from "@/i18n/pages";
import { GalleryView } from "@/views/GalleryView";

export const metadata = staticMeta("en", "gallery");

export default function Page() {
  return <GalleryView lang="en" />;
}
