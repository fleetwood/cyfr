import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import { PostCommentProps, PostCreateProps, PostEngageProps } from "../prismaContext"

const {debug} = useDebug('hooks/usePostApi')

const usePostApi = () => {
  
  const share = async (props: PostEngageProps):Promise<boolean> =>  await (await sendApi("post/share", props)).data
  
  const like = async (props: PostEngageProps):Promise<boolean>  =>  await (await sendApi("post/like", props)).data
  
  const createPost = async (props: PostCreateProps) => await sendApi("post/create", props)

  const commentOnPost = async (props:PostCommentProps) => await (await sendApi("post/comment", props)).data

  return {
    share,
    like,
    createPost,
    commentOnPost
  }
}

export default usePostApi