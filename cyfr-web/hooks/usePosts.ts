import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { PostCommentProps, PostCreateProps, PostEngageProps, PostWithDetails } from "../prisma/types/post"
import { getApi, sendApi } from "../utils/api"
import { log } from "../utils/log"

const allPostsQuery = "allPostsQuery"

export async function getPosts() {
  const data = await getApi(`post`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export const usePosts = () => {
  const qc = useQueryClient()
  const [posts, setPosts] = useState<PostWithDetails[]>()
  const [commentId, setCommentId] = useState<string|null>(null)

  const query = useQuery(
    [allPostsQuery],
    getPosts,
    {
      onSettled(data,error) {
        if (error || data === null) {
          log(
            `\tusePostsApi.onSettled(${allPostsQuery}) ERROR ${JSON.stringify({ error, data })}`
          )
        }
        if (data) {
          log(`\tusePostsApi.onSettled() success`)
          setPosts(() => data as PostWithDetails[])
        }
      }
    }
  )

  const send = async (url:string, props:unknown) => {
    const res = await sendApi(url, props)
    if (res) {
      invalidatePosts()
      return res
    }
    return null
  }

  const create = async (props: PostCreateProps) => await send("post/create", props)

  const share = async (props: PostEngageProps) => await send("post/share", props)

  const like = async (props: PostEngageProps) => await send("post/like", props)

  const comment = async (props:PostCommentProps) => await send("post/comment", props)

  const invalidatePosts = () => qc.invalidateQueries([allPostsQuery])
  
  return {posts, create, share, like, comment, commentId, setCommentId, invalidatePosts}
}

export default usePosts
