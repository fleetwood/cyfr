import { CommentThread, GalleryStub, ImageStub, PostStub } from "prisma/prismaContext"
import useDebug from "./useDebug"
import useRocketQuery from "./useRocketQuery"

export const postFeedQuery = ['feed', { type: 'post'}]
export const galleryFeedQuery = ['feed', { type: 'gallery'}]
export const imageFeedQuery = ['feed', { type: 'image'}]
export const inboxFeedQuery = ['feed', { type: 'inbox' }]
export const articleFeedQuery = ['feed', { type: 'article' }]

const {debug, info} = useDebug('useFeed')

export type FeedTypes = 'article'|'post'|'gallery'|'inbox'|'image'

export const useFeed = <T>(type:FeedTypes) => {
  const name = ['feed', type.toString()]
  return  type === 'article' ? useRocketQuery<T>({name, url: 'article/feed', body: {take:0, skip: 0}}) :
          type === 'gallery' ? useRocketQuery<T>({name, url: 'gallery/feed', body: {take:0, skip: 0}}) :
          type === 'inbox' ? useRocketQuery<T>({name, url: 'user/inbox'}) :
          type === 'image' ? useRocketQuery<T>({name, url: 'image/feed', body: {take:0, skip: 0}}) :
          // default to post
          useRocketQuery<T>({name, url: 'post/feed', body: {take:0, skip: 0}})
}

export default useFeed
