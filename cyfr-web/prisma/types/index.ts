import {
    Post,
    User,
    Share,
    Like,
    Follow,
    Fan,
    Image,
    Gallery
  } from "@prisma/client/edge"
  import { ShareDeleteProps, ShareFeed } from "./share.def"
  import { GalleryFeed, GalleryDetail, GalleryDetailInclude, GalleryEngageProps, GalleryCreateProps, GalleryFeedInclude } from './gallery.def';
  import { UserFeed, UserDetail, CyfrUser, UserDetailInclude, UserFeedInclude } from './user.def';
  import {
    PostCreateProps,
    PostDeleteProps,
    PostEngageProps,
    PostCommentProps,
    PostFeed,
    PostDetail,
  } from "./post.def"

import {ShareWithAuthorPost, ShareWithAuthorPostInclude} from './like.def'
import { ImageFeed, ImageFeedInclude, ImageDetailInclude, ImageDetail } from './image.def';
import { PostFeedInclude, PostDetailInclude } from './post.def';

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
    ShareWithAuthorPostInclude,
    GalleryFeedInclude, GalleryDetailInclude,
    ImageFeedInclude, ImageDetailInclude,
    PostFeedInclude, PostDetailInclude,
    UserFeedInclude, UserDetailInclude
}

export type {
    // from prisma client
    Post,User,Share,Like,Follow,Fan,Image,Gallery,
    // from Gallery defs
    GalleryFeed, GalleryDetail, 
    GalleryCreateProps, GalleryEngageProps,
    // from image defs
    ImageFeed, ImageDetail,
    // from user defs
    UserFeed, UserDetail, CyfrUser,
    // from share defs
    ShareDeleteProps, ShareFeed,
    // from Posts defs
    PostFeed,PostDetail,
    PostCreateProps, PostDeleteProps, PostEngageProps, PostCommentProps,
    // from like defs
    ShareWithAuthorPost,
    // from here (types)
    MainFeed,
}