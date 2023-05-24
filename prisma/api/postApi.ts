import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import { PostCommentProps, PostCreateProps, PostEngageProps } from "../prismaContext"

const {debug} = useDebug('prisma/api/postApi')

const PostApi = () => {

  const createPost = async (props: PostCreateProps) => await sendApi("post/create", props)
  
  const sharePost = async (props: PostEngageProps):Promise<boolean> => {
    const share = await (await sendApi("post/share", props)).data
    if (share.result) {
      return true
    } else {
      debug("Did not get right result?", share.result)
      return false
    }
  }

  const likePost = async (props: PostEngageProps):Promise<boolean>  => {
    const like = await (await sendApi("post/like", props)).data
    if (like.result) {
      return true
    } else {
      debug("Did not get right result?", like.result)
      return false
    }
  }

  const commentOnPost = async (props:PostCommentProps) => await sendApi("post/comment", props)

  return {
    createPost,
    sharePost,
    likePost,
    commentOnPost
  }
}

export default PostApi