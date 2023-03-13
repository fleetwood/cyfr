import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { MainFeed, PostCommentProps, PostCreateProps, PostEngageProps } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useDebug from "./useDebug"
const {debug, info} = useDebug("useMainFeed")

export const mainFeedQuery = ['feed', { type: 'mainPage'}]

export async function getMainFeed() {
  const data = await getApi(`feed/main`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export const useMainFeed = () => {
  const qc = useQueryClient()
  const [feed, setFeed] = useState<MainFeed[]>()
  const [commentId, setCommentId] = useState<string|null>(null)

  const query = useQuery(
    mainFeedQuery,
    getMainFeed,
    {
      onSettled(data,error) {
        if (error || data === null) {
          info(`onSettled(${mainFeedQuery}) ERROR`,{ error, data })
        }
        if (data) {
          setFeed(() => data as MainFeed[])
        }
      }
    }
  )

  const send = async (url:string, props:unknown) => {
    const res = await sendApi(url, props)
    if (res) {
      invalidateMainFeed()
      return res
    }
    return null
  }

  const createPost = async (props: PostCreateProps) => await send("post/create", props)

  const sharePost = async (props: PostEngageProps) => await send("post/share", props)

  const likePost = async (props: PostEngageProps) => await send("post/like", props)

  /**
   * 
   * @param props commentId, authorId, content
   * @returns 
   */
  const commentOnPost = async (props:PostCommentProps) => await send("post/comment", props)

  const invalidateMainFeed = () => qc.invalidateQueries([mainFeedQuery])
  
  return {feed, createPost, sharePost, likePost, commentOnPost, commentId, setCommentId, invalidateMainFeed}
}

export default useMainFeed
