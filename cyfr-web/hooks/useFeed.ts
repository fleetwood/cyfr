import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { GalleryCreateProps, GalleryEngageProps, GalleryFeed, MainFeed, PostCommentProps, PostCreateProps, PostEngageProps, PostFeed } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { log } from "../utils/log"

export const mainFeedQuery = ['feed', { type: 'main'}]
export const postFeedQuery = ['feed', { type: 'post'}]
export const galleryFeedQuery = ['feed', { type: 'gallery'}]
export const imageFeedQuery = ['feed', { type: 'image'}]

export async function getMainFeed():Promise<MainFeed[]|null> {
  const data = await getApi(`feed/main`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export async function getPosts():Promise<PostFeed[]|null> {
  const data = await getApi<PostFeed[]|null>(`post/all`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export async function getGalleries():Promise<GalleryFeed[]|null> {
  const data = await getApi<GalleryFeed[]|null>(`gallery/all`)
  if (data.result) {
    const posts = data.result
    return posts
  }
  return null
}

export type FeedTypes = {
  type: 'main'|'post'|'gallery'
}

export const useFeed = ({type}:FeedTypes) => {
  const qc = useQueryClient()
  const [feed, setFeed] = useState<any[]>([])

  const [commentId, setCommentId] = useState<string|null>(null)

  const query = useQuery(
    type === 'main' ? mainFeedQuery :
    type === 'post' ? postFeedQuery :
    type === 'gallery' ? galleryFeedQuery :
    ['feed'],
    type === 'main' ? getMainFeed :
    type ==='post' ? getPosts :
    type ==='gallery' ? getGalleries :
    () => {},
    {
      onSettled(data,error) {
        if (error || data === null) {
          log(
            `\tuseMainFeed.onSettled(${mainFeedQuery}) ERROR ${JSON.stringify({ error, data })}`
          )
        }
        if (data) {
            setFeed(data)
        }
      }
    }
  )

  const send = async (url:string, props:unknown) => {
    const res = await sendApi(url, props)
    if (res) {
      return res
    }
    return null
  }

  const createPost = async (props: PostCreateProps) => await send("post/create", props)

  const sharePost = async (props: PostEngageProps) => await send("post/share", props)

  const likePost = async (props: PostEngageProps) => await send("post/like", props)

  const createGallery = async (props: GalleryCreateProps) => await send("gallery/create", props)

  const shareGallery = async (props: GalleryEngageProps) => await send("gallery/share", props)

  const likeGallery = async (props: GalleryEngageProps) => await send("gallery/like", props)

  /**
   * 
   * @param props commentId, authorId, content
   * @returns 
   */
  const commentOnPost = async (props:PostCommentProps) => await send("post/comment", props)

  const invalidateFeed = (t?:'main'|'post') => {
    const q = t ? ['feed', {type: t}] : ['feed']
    log(`invalidating ${JSON.stringify(q)}`)
    qc.invalidateQueries(q)
  }
  
  return {feed, 
    createPost, sharePost, likePost, commentOnPost, 
    createGallery, shareGallery, likeGallery,
    commentId, setCommentId, 
    invalidateFeed}
}

export default useFeed
