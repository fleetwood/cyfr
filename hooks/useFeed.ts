import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { BookStub, CharacterStub, CommentThread, GalleryCreateProps, GalleryEngageProps, GalleryStub, MainFeed, PostCommentProps, PostCreateProps, PostEngageProps, PostStub, StartInboxThreadProps, UpsertInboxProps } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import useDebug from "./useDebug"

export const mainFeedQuery = ['feed', { type: 'main'}]
export const postFeedQuery = ['feed', { type: 'post'}]
export const galleryFeedQuery = ['feed', { type: 'gallery'}]
export const imageFeedQuery = ['feed', { type: 'image'}]
export const inboxFeedQuery = ['feed', { type: 'inbox'}]

const {debug} = useDebug("useFeed","DEBUG")

export type FeedTypes = 'main'|'post'|'gallery'|'inbox'

export const useFeed = (type:FeedTypes) => {
  const qc = useQueryClient()
  const [feed, setFeed] = useState<any[]>([])

  const [commentId, setCommentId] = useState<string|null>(null)

  const getMainFeed = async ():Promise<MainFeed[]|null> => {
    const result = await getApi(`feed/main`)
    debug('getMainFeed')
    try {
      return result.map((r:any) => {
        // aggregating mainFeed requires a UNION ALL between post and shares
        // in V_feed_main, which in turn requires casting the json_agg records
        // to ::text   so here we have to parse those records back to json
        //
        // oy.
        return {
          ...r,
          post: JSON.parse(r.post) as PostStub,
          gallery: JSON.parse(r.gallery) as GalleryStub,
          character: JSON.parse(r.character) as CharacterStub,
          book: JSON.parse(r.book) as BookStub,
        }
      })
      .sort((a:MainFeed,b:MainFeed) => a.updatedAt > b.updatedAt ? -1 : 1)  
    } catch (error) {
      debug('getMaindFeed', error)
      return null
    }
  }
  
  const getPosts = async ():Promise<PostStub[]|null> => {
    const data = await getApi<PostStub[]|null>(`post/all`)
    if (data.result) {
      const posts = data.result
      return posts
    }
    return null
  }
  
  const getGalleries = async ():Promise<GalleryStub[]|null> => {
    const data = await getApi<GalleryStub[]|null>(`gallery/stubs`)
    if (data.result) {
      const posts = data.result
      return posts
    }
    return null
  }
  
  const getInbox = async (): Promise<CommentThread|null> => {
    const data = await getApi(`user/inbox`)
    if (data.result) {
      const inbox = data.result
      return inbox
    }
    return null
  }

  const query = useQuery(
    type === 'main' ? mainFeedQuery :
    type === 'post' ? postFeedQuery :
    type === 'gallery' ? galleryFeedQuery :
    type === 'inbox' ? inboxFeedQuery :
    ['feed'],
    type === 'main' ? getMainFeed :
    type ==='post' ? getPosts :
    type ==='gallery' ? getGalleries :
    type ==='inbox' ? getInbox :
    () => {},
    {
      onSettled(data,error) {
        if (error || data === null) {
          debug(`onSettled(${type}) ERROR`,{ error, data })
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

  const sendMessage = async (props:UpsertInboxProps) => await send('user/inbox/send', props)

  const invalidateFeed = (t?:FeedTypes) => {
    const queryKey = t ? ['feed', {type: t}] : ['feed']
    const q = {queryKey}
    debug(`invalidateFeed`,{queryKey})
    qc.invalidateQueries({queryKey})
  }
  
  return {feed, 
    createPost, sharePost, likePost, commentOnPost, 
    createGallery, shareGallery, likeGallery,
    commentId, setCommentId, 
    sendMessage,
    invalidateFeed}
}

export default useFeed
