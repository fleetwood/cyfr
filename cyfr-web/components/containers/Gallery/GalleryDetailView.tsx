import Link from "next/link";
import { GalleryDetail } from "./../../../prisma/prismaContext";
import GalleryCreateView from "./GalleryCreateView";
import GalleryFooter from "./GalleryFooter";

type GalleryDetailViewProps = {
  gallery: GalleryDetail;
};

const GalleryItemView = ({ gallery }: GalleryDetailViewProps) => (
  <div className="rounded-lg bg-base-300 text-base-content my-4">
    {gallery.title && (
      <Link href={`/gallery/${gallery.id}`}>
        <h2 className="h-subtitle p-4">{gallery.title}</h2>
      </Link>
    )}
    {gallery.description && (
      <div className="min-w-full p-4 bg-base-100">{gallery.description}</div>
    )}
    <div className="min-w-full p-4 space-x-2">
      <div className="columns-2 md:columns-4 lg:columns-6">
        {gallery.images.map((image) => (
          <img className="mb-4" src={image.url} key={`gallery-detail:${gallery.id}:${image.id}`} />
        ))}
      </div>
    </div>
    <div className="min-w-full">
      <GalleryFooter gallery={gallery} feed={{ type: "gallery" }} />
    </div>
  </div>
);

export default GalleryItemView;
