import useFeed from "hooks/useFeed"
import useDebug from "hooks/useDebug"
import { sendApi } from "utils/api"
import { GalleryCreateProps, GalleryEngageProps } from "prisma/prismaContext"

const {debug} = useDebug('hooks/useGalleryApi')

const useGalleryApi = () => {

  const {invalidate} = useFeed('gallery')

  const createGallery = async (props: GalleryCreateProps) => await sendApi("gallery/create", props)

  const share = async (props: GalleryEngageProps):Promise<boolean> => await (await sendApi("gallery/share", props)).data

  const like = async (props: GalleryEngageProps):Promise<boolean>  => await (await sendApi("gallery/like", props)).data

  return {
    createGallery,
    share,
    like,
    invalidate
  }
}

export default useGalleryApi