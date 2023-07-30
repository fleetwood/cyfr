import { useToast } from "components/context/ToastContextProvider"
import { CoverStub, Image, ImageStub } from "prisma/prismaContext"
import { useEffect, useState } from "react"
import { cloudinary } from "utils/cloudinary"
import useDebug from "hooks/useDebug"
import { ItemProps } from "react-photoswipe-gallery"
import GalleryImages from "./GalleryImages"

const {debug} = useDebug('containers/Gallery/GalleryCovers', 'DEBUG')

type GalleryCoversProps = {
  covers?:      CoverStub[]
  selectable?:  Boolean
  onSelect?:    (image: CoverStub) => void
}

/**
 * 
 * @param param0 
 * @see https://github.com/dromru/react-photoswipe-gallery/discussions/1220
 * @returns 
 */
const GalleryCovers = ({
  covers,
  selectable = false,
  onSelect
}:GalleryCoversProps) => {
  const {notify, notifyError} = useToast()
  const [imageList, setImageList] = useState<Image[]>([])

  const onSelectImage = (image:ImageStub|Image) => {
    if (!selectable || !onSelect) return
    const cover = covers?.find((c:CoverStub) => c.image.id === image.id)
    if (cover) { onSelect(cover) } else { notifyError() }
  }

  const mapImages = (covers:CoverStub[]):Image[] => covers
    .filter((c:CoverStub) => c.image !== null)
    .map((c:CoverStub) => { return c.image})

  useEffect(() => {
    debug('useEffect', {covers})
    try {
      const list = mapImages(covers??[])
      setImageList(() => list)
    }
    catch(e) {
      debug('useEffect FAIL', e)
    }
  }, [covers])

  return <GalleryImages images={imageList} selectable={selectable} onSelect={onSelectImage} />
}
export default GalleryCovers
