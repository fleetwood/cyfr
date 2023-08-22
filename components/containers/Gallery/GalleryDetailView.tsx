import JsonBlock from "components/ui/jsonBlock";
import { GalleryDetail } from "prisma/prismaContext";
import GalleryFooter from "./GalleryFooter";
import GalleryPhotoswipe from "./GalleryImages";

type GalleryDetailViewProps = {
  gallery: GalleryDetail
  onUpdate?: () => void
  showTitle?: boolean
  showFooter?: boolean
};

const GalleryDetailView = ({gallery, onUpdate, showTitle = true, showFooter = true}: GalleryDetailViewProps) => {
  
  return (
    <div className="rounded-lg bg-base-300 text-base-content my-4">
      {/* <JsonBlock data={gallery} debug={true} /> */}
      {showTitle && gallery.title && (
        <h2 className="h-subtitle p-4">{gallery.title}</h2>
      )}
      {gallery.description && (
        <div className="min-w-full p-4 bg-base-100">
          {gallery.description}
        </div>
      )}
      <div className="min-w-full p-4 space-x-2">
        <GalleryPhotoswipe gallery={gallery} />
      </div>
      {showFooter &&
        <div className="min-w-full">
          <GalleryFooter gallery={gallery} onUpdate={onUpdate} />
        </div>
      }
    </div>
)}

export default GalleryDetailView;
