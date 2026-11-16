import { staticMeta } from "@/i18n/pages";
import { GalleryView } from "@/views/GalleryView";

export const metadata = staticMeta("de", "gallery");

export default function Page() {
  return <GalleryView lang="de" />;
}
