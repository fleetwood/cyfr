import Link from "next/link";
import { GalleryDetail } from "./../../../prisma/prismaContext";
import GalleryCreateView from "./GalleryCreateView";
import GalleryFooter from "./GalleryFooter";
import { useRef, useState } from "react";
import ImageFeedView from '../Image/ImageFeedView';
import { ImageFeed } from '../../../prisma/types/image.def';
import { uniqueKey } from '../../../utils/helpers';
import { log } from "../../../utils/log";
import Image from "next/image";
import ImagePreview from '../Image/ImagePreview';
import GalleryPhotoswipe from "./GalleryPhotoswipe";
import { cloudinary } from "../../../utils/cloudinary";

type GalleryDetailViewProps = {
  gallery: GalleryDetail;
};

const GalleryItemView = ({ gallery }: GalleryDetailViewProps) => {
  const galleryImageModal = "galleryImageModal";
  const modal = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);

  const activeClass = 'scale-100 opacity-100'
  const inactiveClass = 'scale-0 h-0 opacity-0'
  const linearTransition = 'transition-all duration-200 ease-in-out'

  const [activeImage1, setActiveImage1] = useState<ImageFeed | null>(null)
  const [activeImage2, setActiveImage2] = useState<ImageFeed | null>(null)
  
  const [active1Class, setActive1Class] = useState<string>(inactiveClass)
  const [active2Class, setActive2Class] = useState<string>(inactiveClass)

  const setImage = (img: ImageFeed) => {
    log(`setImage`,img)
    if (active1Class===inactiveClass) {
      setActiveImage1(() => img)
      setActive1Class(() => activeClass)
      setActive2Class(() => inactiveClass)
    } else {
      setActiveImage2(() => img)
      setActive1Class(() => inactiveClass)
      setActive2Class(() => activeClass)
    }
    setChecked(true);
  };

  const closeModal = () => {
    setChecked(false);
    setActiveImage1(null);
  };

  const noop = (e:any) => {try {e.stopPropagation()} catch(err) {}}

  return (
    <>
      <input type="checkbox" ref={modal} id={galleryImageModal} className="modal-toggle" checked={checked} />
      
      <div className="rounded-lg bg-base-300 text-base-content my-4">
        {gallery.title && (
          <Link href={`/gallery/${gallery.id}`}>
            <h2 className="h-subtitle p-4">{gallery.title}</h2>
          </Link>
        )}
        {gallery.description && (
          <div className="min-w-full p-4 bg-base-100">
            {gallery.description}
          </div>
        )}
        <div className="min-w-full p-4 space-x-2">
        <GalleryPhotoswipe items={gallery.images.map((img) => {
            return {
              original: img.url,
              thumbnail: cloudinary.thumb({url: img.url, width:60}),
              alt: img.title
            }
          })} />
        </div>
        <div className="min-w-full">
          <GalleryFooter gallery={gallery} feed={{ type: "gallery" }} />
        </div>
      </div>
    </>
)}

export default GalleryItemView;
