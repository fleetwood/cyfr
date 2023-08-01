// @ts-nocheck
import "photoswipe/dist/photoswipe.css"

import { useToast } from "components/context/ToastContextProvider"
import useDebug from "hooks/useDebug"
import { Image } from "prisma/prismaContext"
import useApi from "prisma/useApi"
import { useEffect, useState } from "react"
import { Item, Gallery as PhotoGallery } from "react-photoswipe-gallery"
import { cloudinary } from "utils/cloudinary"
import { uniqueKey, uuid } from "utils/helpers"
import ImageFooter from "../Image/ImageFooter"

const {debug} = useDebug('containers/Gallery/GalleryImages', )

type GalleryImagesProps = {
  gallery?:     GalleryDetail | null
  items?:       ItemProps[]
  images?:      ImageStub[]|Image[]
  key?:         string
  selectable?:  Boolean
  onSelect?:    (image: ImageStub | ImageStub) => void
}

/**
 * 
 * @param param0 
 * @see https://github.com/dromru/react-photoswipe-gallery/discussions/1220
 * @returns 
 */
const GalleryImages = ({
  gallery, 
  items, 
  images, 
  key = uuid(),
  selectable = false,
  onSelect
}:GalleryImagesProps) => {
  const {like, share} = useApi.image()
  const {cyfrUser} = useApi.cyfrUser()
  const {notify} = useToast()

  const likeButton = {
    name: `like-button`,
    ariaLabel: 'Like',
    order: 12,
    isButton: true,
    tagName: 'div',
    appendTo: 'bar',
    html: `
      <svg aria-hidden="true" class="absolute left-0 pswp__icn" viewBox="0 0 32 32" width="32" height="32">
        {/* <use class="pswp__icn-shadow" xlink:href="#pswp__icn-like"></use> */}
        <path d="M22.229,4.514c-2.547,0-4.85,1.334-5.919,3.414c-1.07-2.079-3.401-3.414-5.948-3.414  c-3.981,0-9.319,3.209-6.888,11.963C6.251,25.034,16.31,30.065,16.31,30.063c0,0.002,10.044-5.029,12.821-13.586  C31.562,7.723,26.209,4.514,22.229,4.514z"></path>
      </svg>
    `,
    onClick: async (e, item, pswp) => {
      // userid is provided by context
      if (await like({creatorId: cyfrUser.id, imageId: pswp.currSlide.data.pid})) {
        notify('You liked this image.', 'success')
      }
    },
    onInit: (btn, pswp) => {
      console.log('onInit', btn, pswp)
    }
  }
  const shareButton = {
    name: `share-button`,
    ariaLabel: 'Share',
    order: 11,
    isButton: true,
    tagName: 'a',
    appendTo: 'bar',
    html: {
      isCustomSVG: true,
      inner: '<path d="M13.619 21.9999C13.4244 21.9998 13.2336 21.9457 13.0679 21.8434C12.9023 21.7412 12.7683 21.5949 12.681 21.4209L9.57202 15.1999C9.48817 15.0317 9.4509 14.8442 9.46409 14.6567C9.47728 14.4692 9.54045 14.2887 9.64702 14.1339L14.667 7.33393L7.86702 12.3519C7.71243 12.4585 7.53208 12.5217 7.34477 12.5349C7.15745 12.5481 6.97003 12.5108 6.80202 12.4269L0.579023 9.31793C0.396943 9.22616 0.245586 9.08328 0.143499 8.90677C0.041413 8.73027 -0.0069687 8.52783 0.00428273 8.32424C0.0155342 8.12065 0.0859301 7.92477 0.206844 7.76059C0.327759 7.59641 0.493939 7.47107 0.685023 7.39993L20.59 0.06393C20.7778 -0.00545316 20.9815 -0.0195568 21.177 0.0232902C21.3726 0.0661373 21.5517 0.164139 21.6933 0.305683C21.8348 0.447227 21.9328 0.62638 21.9757 0.821914C22.0185 1.01745 22.0044 1.22117 21.935 1.40893L14.6 21.3149C14.5294 21.5067 14.4042 21.6736 14.2398 21.7949C14.0754 21.9163 13.8791 21.9869 13.675 21.9979L13.619 21.9999Z" />',
      outlineID: 'pswp__icn-share'
    },
    onClick: (e, item, pswp) => {
      const sharey = async () => {
        const shared = await share({creatorId: cyfrUser.id, imageId: pswp.currSlide.data.pid})
        if (shared) {
          notify('You shared this image. Domo! ^___^', 'success')
        }
      }
      sharey()
    }
  }
  const selectButton = {
    name: `select-button`,
    ariaLabel: 'Choose this cover',
    order: 10,
    isButton: true,
    tagName: 'a',
    appendTo: 'bar',
    html: {
      isCustomSVG: true,
      inner: '<path d="M30.171,6.131l-0.858-0.858c-0.944-0.945-2.489-0.945-3.433,0L11.294,19.859l-5.175-5.174  c-0.943-0.944-2.489-0.944-3.432,0.001l-0.858,0.857c-0.943,0.944-0.943,2.489,0,3.433l7.744,7.75c0.944,0.945,2.489,0.945,3.433,0  L30.171,9.564C31.112,8.62,31.112,7.075,30.171,6.131z" />',
      outlineID: 'pswp__icn-share'
    },
    onClick: (e, item, pswp) => onSelect(pswp.currSlide.data)
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
  
  const elements = selectable ? [shareButton,likeButton, selectButton] : [shareButton,likeButton]

  return (
    <PhotoGallery uiElements={elements}>
      <div className="min-w-full">
        <div className="columns-2 md:columns-4 lg:columns-6 space-y-1 justify-evenly">
          {imageList.map(item => (
            <Item {...item} key={uniqueKey(key,item)}>
              {({ ref, open }) => (
                <div className="cursor-pointer relative transition-all duration-200 ease-out" ref={ref}>
                  {/* <ImageStubView image={item} onClick={(e) => open(e)}  /> */}
                  <div className={`relative rounded-lg overflow-hidden image-preview`}>
                    <img className="rounded-lg drop-shadow-md" src={item.url} onClick={(e) => open(e)} />
                    {item.title &&
                      <div className="image-header">
                        {item.title}
                      </div>
                    }
                    <div className="image-footer w-full">
                      <ImageFooter image={item} selectable={selectable} onSelect={onSelect} />
                    </div>
                  </div>
                </div>
              )}
            </Item>
          ))}
        </div>
      </div>
    </PhotoGallery>
  )
}
export default GalleryImages
