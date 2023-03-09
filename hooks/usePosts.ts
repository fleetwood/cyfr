import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getApi, sendApi } from "../utils/api"
import { PostCommentProps, PostCreateProps, PostEngageProps, PostFeed } from "../prisma/prismaContext"
import useDebug from "./useDebug"
const {debug, info} = useDebug({fileName: "usePosts"})

export const allPostsQuery = ['feed', {type: 'posts'}]

export async function getPosts() {
  const data = await getApi(`post/all`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export const usePosts = () => {
  const qc = useQueryClient()
  const [posts, setPosts] = useState<PostFeed[]>()
  const [commentId, setCommentId] = useState<string|null>(null)

  const query = useQuery(
    allPostsQuery,
    getPosts,
    {
      onSettled(data,error) {
        if (error || data === null) {
          info(`onSettled(${allPostsQuery}) ERROR`,{ error, data })
        }
        if (data) {
          setPosts(() => data as PostFeed[])
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

  /**
   * 
   * @param props commentId, authorId, content
   * @returns 
   */
  const comment = async (props:PostCommentProps) => await send("post/comment", props)

  const invalidatePosts = () => {
    const queryKey = allPostsQuery
    const q = {queryKey}
    debug(`invalidatePosts`, {allPostsQuery, queryKey, q})
    return qc.invalidateQueries(queryKey)}
  
  return {posts, create, share, like, comment, commentId, setCommentId, invalidatePosts}
}

export default usePosts
