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
      
      <label htmlFor={galleryImageModal} className="modal cursor-pointer" onClick={closeModal} >
        <label className="modal-box relative bg-base-300 bg-opacity-50 scrollbar-hide min-h-max" htmlFor={galleryImageModal} onClick={noop}>
          <div className="mb-3 p-4 rounded-xl bg-primary text-primary-content min-h-max md:bg-blend-hard-light md:bg-opacity-80"  onClick={noop}>

            <ImagePreview image={activeImage1} className={`m-auto object-contain rounded-lg ${active1Class} ${linearTransition}`} onClick={noop}/>
            <ImagePreview image={activeImage2} className={`m-auto object-contain rounded-lg ${active2Class} ${linearTransition}`} onClick={noop}/>
            
            <div className="relative rounded-xl overflow-hidden my-4" onClick={noop}>
              <div className="relative rounded-xl" onClick={noop}>
                <div className="relative" onClick={noop}>
                  <div className="relative flex gap-6 snap-x snap-mandatory overflow-x-auto" onClick={(e) => e.stopPropagation()}>
                  {gallery.images.map((image) => 
                    <div className="snap-center shrink-0"
                      key={uniqueKey(`gallery-detail-modal`, gallery, image)}  onClick={noop}>
                      <img 
                        className="shrink-0 h-28 mb-4 rounded-lg drop-shadow-md scale-95 transition-all duration-100 ease-linear opacity-80 hover:scale-100 hover:opacity-100 cursor-pointer hover:drop-shadow-xl" 
                        src={image.url} 
                        onClick={(e) => {e.stopPropagation(); setImage(image as unknown as ImageFeed)}} />
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </label>
      </label>

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
          <div className="columns-2 md:columns-4 lg:columns-6">
            {gallery.images.map((image) => (
              <img
                className="mb-4 rounded-lg drop-shadow-md scale-95 transition-all duration-100 ease-linear opacity-80 hover:scale-100 hover:opacity-100 cursor-pointer hover:drop-shadow-xl"
                src={image.url}
                key={uniqueKey('gallery-detail',gallery,image)}
                onClick={() => setImage(image)}
              />
            ))}
          </div>
        </div>
        <div className="min-w-full">
          <GalleryFooter gallery={gallery} feed={{ type: "gallery" }} />
        </div>
      </div>
    </>
)}

export default GalleryItemView;
