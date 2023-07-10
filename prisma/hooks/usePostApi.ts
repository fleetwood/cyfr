import useRocketQuery from "hooks/useRocketQuery"
import useDebug from "hooks/useDebug"
import { getApi, sendApi } from "utils/api"
import { PostCommentProps, PostCreateProps, PostDetail, PostEngageProps } from "prisma/prismaContext"

const {debug} = useDebug('hooks/usePostApi')

  const query = (postId:string) => useRocketQuery<PostDetail>({
    name: [`postDetail-${postId}`, { type: 'post'}],
    url: `/post/${postId}`
  })

  const share = async (props: PostEngageProps):Promise<boolean> =>  await (await sendApi("post/share", props)).data
  
  const like = async (props: PostEngageProps):Promise<boolean>  =>  await (await sendApi("post/like", props)).data

  const info = async (id:string) => await (await getApi(`user/${id}/info`)).data
  
  const createPost = async (props: PostCreateProps) => await sendApi("post/create", props)

  const commentOnPost = async (props:PostCommentProps) => await (await sendApi("post/comment", props)).data

const usePostApi = () => {
  return {
    query,
    share,
    like,
    createPost,
    commentOnPost
  }
}

export default usePostApi