import { CommentThread, GalleryStub, ImageStub, PostStub } from "prisma/prismaContext"
import useDebug from "./useDebug"
import useRocketQuery from "./useRocketQuery"

export const postFeedQuery = ['feed', { type: 'post'}]
export const galleryFeedQuery = ['feed', { type: 'gallery'}]
export const imageFeedQuery = ['feed', { type: 'image'}]
export const inboxFeedQuery = ['feed', { type: 'inbox'}]

const {debug, info} = useDebug('useFeed')

export type FeedTypes = 'post'|'gallery'|'inbox'|'image'

export const useFeed = (type:FeedTypes) => {
  const name = ['feed', { type: type.toString()}]  
  return  type === 'gallery' ? useRocketQuery<GalleryStub[]>({name, url: 'gallery/feed', body: {take:0, skip: 0}}) :
          type === 'inbox' ? useRocketQuery<CommentThread>({name, url: 'user/inbox'}) :
          type === 'image' ? useRocketQuery<ImageStub[]>({name, url: 'image/feed', body: {take:0, skip: 0}}) :
          // default to post
          useRocketQuery<PostStub[]>({name, url: 'post/feed', body: {take:0, skip: 0}})
}

export default useFeed
