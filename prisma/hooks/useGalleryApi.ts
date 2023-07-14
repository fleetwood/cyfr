import useFeed from "hooks/useFeed"
import useDebug from "hooks/useDebug"
import { sendApi } from "utils/api"
import { GalleryCreateProps, GalleryEngageProps, GalleryStub } from "prisma/prismaContext"
import useRocketQuery from "hooks/useRocketQuery"

const {debug} = useDebug('hooks/useGalleryApi')

const useGalleryApi = () => {

  const userGalleries = (slug:string) => useRocketQuery<GalleryStub[]>({
    name: [`userGalleries-${slug}`, { type: 'gallery'}, { type: 'image'}, { type: 'user'}],
    url: `/gallery/${slug}`
  })

  const feed = () => useRocketQuery({
    name: [`feed`, { type: 'gallery'}, { type: 'image'}],
    url: `/gallery/feed/`
  })

  const createGallery = async (props: GalleryCreateProps) => await sendApi("gallery/create", props)

  const share = async (props: GalleryEngageProps):Promise<boolean> => await (await sendApi("gallery/share", props)).data

  const like = async (props: GalleryEngageProps):Promise<boolean>  => await (await sendApi("gallery/like", props)).data

  return {
    userGalleries,
    feed,
    createGallery,
    share,
    like,
  }
}

export default useGalleryApi