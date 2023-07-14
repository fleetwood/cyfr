import useDebug from "hooks/useDebug"
import { ImageEngageProps } from "prisma/prismaContext"
import { sendApi } from "utils/api"

const {debug} = useDebug('hooks/useImageApi')

const useImageApi = () => {

  const share = async (props: ImageEngageProps):Promise<boolean> => await (await sendApi("image/share", props)).data

  const like = async (props: ImageEngageProps):Promise<boolean>  => await (await sendApi("image/like", props)).data

  return {
    share,
    like
  }
}

export default useImageApi