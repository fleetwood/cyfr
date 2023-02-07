import Link from "next/link";
import { GalleryFeed } from "./../../../prisma/prismaContext";
import { uniqueKey } from '../../../utils/helpers';

type GalleryItemViewProps = {
  gallery: GalleryFeed;
};

const GalleryItemView = ({ gallery }: GalleryItemViewProps) => (
  <Link href={`/gallery/${gallery.id}`}>
    <div className="bg-base-300 text-base-content rounded-lg p-4 m-4">
      <h2 className="h-subtitle">{gallery.title}</h2>

      <div className="columns-2 md:columns-4 lg:columns-6">
        {gallery.images.map((image) => (
          <img className="mb-4" src={image.url} key={uniqueKey('galleryItemView',gallery,image)} />
        ))}
      </div>
    </div>
  </Link>
);

export default GalleryItemView;
