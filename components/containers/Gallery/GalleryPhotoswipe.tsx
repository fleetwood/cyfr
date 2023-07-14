// @ts-nocheck
import "photoswipe/dist/photoswipe.css"

import { Gallery as PhotoGallery, Item } from "react-photoswipe-gallery"
import { ImageFeed, Image, Gallery  } from "prisma/prismaContext"
import { uniqueKey, uuid } from "utils/helpers"
import { cloudinary } from "utils/cloudinary"
import useDebug from "hooks/useDebug"
import { useState, useEffect } from "react"
import ImageStubView from "../Image/ImageStubView"
import ImageFooter from "../Image/ImageFooter"

const {debug} = useDebug('containers/Gallery/GalleryPhotoswipe')

type GalleryPhotoswipeProps = {
  gallery?: GalleryDetail | null
  items?: ItemProps[]
  images?: ImageStub[]|Image[]
  key?: string
  onClick?: (image: ItemProps) => void
}

const GalleryPhotoswipe = ({gallery, items, images, onClick, key = uuid()}:GalleryPhotoswipeProps) => {
  const onUpdate = () => {

  }

  const [imageList, setImageList] = useState<Array<ItemProps>>([])

  const mapImages = (imageCollection:ImageStub[]|Image[]) => imageCollection.filter(img => img !== null).map((img) => {
    return {
      ...img,
      original: img.url,
      thumbnail: cloudinary.thumb({url: img.url, width:60}),
      height: img.height,
      width: img.width,
      alt: img.title,
      // caption: img.caption || null,
      // content: img.content || null,
      id: img.id
    }
  })

  useEffect(() => {
    debug('useEffect', {...items, ...images, gallery: gallery})
    try {
      setImageList(() => 
        items ? items :
        images?.length > 0 ? mapImages(images) :
        gallery?.images?.length > 0 ? mapImages(gallery.images) :
        []
      )
    }
    catch(e) {
      debug('useEffect FAIL', e)
    }
  }, [items, images, gallery])
  
  return (
    <PhotoGallery>
      <div className="min-w-full">
        <div className="columns-2 md:columns-4 lg:columns-6 space-y-1 justify-evenly">
          {imageList.map(item => (
              <Item {...item} key={uniqueKey(key,item)} >
              {({ ref, open }) => (
                // <ImageStubView image={item} />
                  <div className="cursor-pointer relative transition-all duration-200 ease-out" onClick={open} ref={ref}>
                    <ImageStubView image={item} />
                    {/* <label className="z-10 absolute btn btn-xs btn-circle bg-success border-success hover:bg-primary right-0 top-0" onClickCapture={() => onClick ? onClick(item) : {}}>✓</label> */}
                  </div>
              )}
              </Item>
          ))}
        </div>
      </div>
    </PhotoGallery>
  )
}

export default GalleryPhotoswipe
