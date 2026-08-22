import IndustryHeroGallery from "@/components/trizen/IndustryHeroGallery";
import type { GalleryImage } from "@/lib/industries/gallery";

type ToyHeroGalleryProps = {
  images: GalleryImage[];
};

/** @deprecated Use IndustryHeroGallery */
export default function ToyHeroGallery({ images }: ToyHeroGalleryProps) {
  return <IndustryHeroGallery images={images} />;
}
