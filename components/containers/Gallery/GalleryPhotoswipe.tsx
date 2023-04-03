// @ts-nocheck
import "photoswipe/dist/photoswipe.css";

import { Gallery as PhotoGallery, Item } from "react-photoswipe-gallery";
import { ImageFeed, Image, Gallery  } from "../../../prisma/prismaContext";
import { uniqueKey, uuid } from "../../../utils/helpers";
import { cloudinary } from "../../../utils/cloudinary";
import useDebug from "../../../hooks/useDebug";
import { useState, useEffect } from "react";

const {debug} = useDebug('containers/Gallery/GalleryPhotoswipe')

type GalleryPhotoswipeProps = {
  gallery?: Gallery | null
  items?: ItemProps[]
  images?: ImageFeed[] | Image[]
  key?: string
  onClick?: (e: MouseEvent<Element, MouseEvent>) => void
};

const GalleryPhotoswipe = ({gallery, items, images, onClick, key = uuid()}:GalleryPhotoswipeProps) => {
  const [imageList, setImageList] = useState<Array<ItemProps>>([])
//   const smallItemStyles: React.CSSProperties = {
//     cursor: "pointer",
//     objectFit: "cover",
//     width: "100%",
//     maxHeight: "100%",
//   };

  const mapImages = (imageCollection:ImageFeed[]|Image[]) => {
    return imageCollection.map((img) => {
      return {
        original: img.url,
        thumbnail: cloudinary.thumb({url: img.url, width:60}),
        height: img.height,
        width: img.width,
        alt: img.title,
        // caption: img.caption || null,
        // content: img.content || null,
        // id: img.id
      }
    })
  }

  useEffect(() => {
    setImageList(() => 
      items ? items :
      images ? mapImages(images) :
      gallery ? mapImages(gallery.images) :
      []
    )
  }, [])
  
  return (
    <PhotoGallery>
      <div className="min-w-full">
        <div className="columns-2 md:columns-4 lg:columns-6 space-y-1 justify-evenly">
          {imageList.map(item => (
              <Item {...item} key={uniqueKey(key,item)}>
              {({ ref, open }) => (
                  <img className="cursor-pointer rounded-md transition-all duration-200 ease-out opacity-80 scale-90 hover:opacity-100 hover:scale-100"
                      src={item.thumbnail}
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClickCapture={() => onClick ? onClick(item) : {}}
                      onClick={open}
                  />
              )}
              </Item>
          ))}
        </div>
      </div>
    </PhotoGallery>
  );
};

export default GalleryPhotoswipe;
