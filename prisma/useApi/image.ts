import useDebug from "hooks/useDebug"
import { ImageEngageProps, ImageUpsertProps, Image } from "prisma/prismaContext"
import { sendApi } from "utils/api"

const {debug} = useDebug('hooks/useImageApi')

const useImageApi = () => {

  const share = async (props: ImageEngageProps):Promise<boolean> => await (await sendApi("image/share", props)).data

  const like = async (props: ImageEngageProps):Promise<boolean>  => await (await sendApi("image/like", props)).data

  const upsert = async (props: ImageUpsertProps):Promise<Image>  => await (await sendApi("image/upsert", props)).data

  return {
    share,
    like,
    upsert
  }
}

export default useImageApi