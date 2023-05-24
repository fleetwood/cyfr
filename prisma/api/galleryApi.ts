import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import { GalleryCreateProps, GalleryEngageProps } from "../prismaContext"

const {debug} = useDebug('prisma/api/galleryApi')

const GalleryApi = () => {

  const createGallery = async (props: GalleryCreateProps) => await sendApi("gallery/create", props)

  const shareGallery = async (props: GalleryEngageProps):Promise<boolean> => {
    const share = await (await sendApi("gallery/share", props)).data
    if (share.result) {
      return true
    } else {
      debug("Did not get right result?", share.result)
      return false
    }
  }

  const likeGallery = async (props: GalleryEngageProps):Promise<boolean>  => {
    const like = await (await sendApi("gallery/like", props)).data
    if (like.result) {
      return true
    } else {
      debug("Did not get right result?", like.result)
      return false
    }
  }
  // const commentOnGallery = async (props:GalleryCommentProps) => await sendApi("gallery/comment", props)

  return {
    createGallery,
    shareGallery,
    likeGallery,
    // commentOnGallery
  }
}

export default GalleryApi