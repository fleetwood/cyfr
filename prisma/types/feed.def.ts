import MainFeedItem from "../../components/containers/Post/MainFeedItem"
import { PostFeed } from "./post.def"
import { ShareFeed } from "./share.def"

export type MainFeed = {
    type: 'PostFeed' | 'ShareFeed'
    share?: ShareFeed | null
    post?: PostFeed | null
    updatedAt: Date
}

export type MainFeedMapping = {
    posts: any[]
    shares: any[]
}
/**
 * Maps arrays to a MainFeed array, sorted by date DESC
 * @param shares
 * @param posts
 * @returns MainFeed array sorted by date DESC
 */
export const MapToMainFeed = ({shares, posts}:MainFeedMapping):MainFeed[] => {
    
    const result = [
        ...posts.map(post => {
            return {
                type: "PostFeed",
                post,
                updatedAt: post.updatedat
            } as MainFeed
        }),
        ...shares.map(share => {
            return {
                type: "ShareFeed",
                share,
                updatedAt: share.updatedat
            } as MainFeed
        }),
    ]
     return result.sort((a,b) => a.updatedAt > b.updatedAt ? -1 : 1)
}