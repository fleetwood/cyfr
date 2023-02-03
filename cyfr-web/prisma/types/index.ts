import { Post, PostFeed, ShareFeed } from '../prismaContext'
import {ShareWithAuthorPost, ShareWithAuthorPostInclude} from './like.def'

type MainFeed = {
    type: 'PostFeed' | 'ShareFeed'
    share?: ShareFeed | null
    post?: PostFeed | null
    updatedAt: Date
}

type MainFeedMapping = {
    posts?: PostFeed[]
    shares?: ShareFeed[]
}
/**
 * Maps arrays to a MainFeed array, sorted by date DESC
 * @param shares
 * @param posts
 * @returns MainFeed array sorted by date DESC
 */
export const MapToMainFeed = ({shares, posts}:MainFeedMapping):MainFeed[] => {
    let result:MainFeed[] = [];
    if (posts) {
       result = [
        ...result,
        ...posts.map(post => {
            const item:MainFeed = {
                type: "PostFeed",
                post,
                updatedAt: post.updatedAt
            }
            return item;
        }),
       ] 
    }

    if (shares) {
        result = [
         ...result,
         ...shares.map(share => {
             const item:MainFeed = {
                 type: "ShareFeed",
                 share,
                 updatedAt: share.updatedAt
             }
             return item;
         }),
        ] 
     }
     return result.sort((a,b) => a.updatedAt > b.updatedAt ? -1 : 1)
}

export const includes = {
    ShareWithAuthorPostInclude
}

export type {
    MainFeed,
    ShareWithAuthorPost
}