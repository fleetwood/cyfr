import Link from "next/link"
import { GalleryStub } from "prisma/prismaContext"
import GalleryFooter from "./GalleryFooter"
import GalleryPhotoswipe from "./GalleryPhotoswipe"

type GalleryStubViewProps = {
  gallery:      GalleryStub
  showFooter?:  boolean
}

const GalleryStubView = ({gallery, showFooter=true}: GalleryStubViewProps) => {
  
  return (
    <div className="rounded-lg bg-base-300 text-base-content my-4">
      {gallery.title && 
        <Link href={`/gallery/${gallery.id}`}>
          <h2 className="h-subtitle p-4">{gallery.title}</h2>
        </Link>
      }
      {gallery.description && 
        <div className="min-w-full p-4 bg-base-100">
          {gallery.description}
        </div>
      }
      <div className="min-w-full p-4 space-x-2">
        <GalleryPhotoswipe gallery={gallery} />
      </div>
      {showFooter && <GalleryFooter gallery={gallery}/>}
      
    </div>
)}

export default GalleryStubView
