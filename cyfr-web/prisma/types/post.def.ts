import { Like, Post, Share, User } from "@prisma/client"
import { ResponseResult } from "../../types/response";
import { ShareWithAuthorPost, ShareWithAuthorPostInclude } from "./share.def";

export type PostsResponse = ResponseResult<Post[]>;
export type PostResponse = ResponseResult<Post>;

export type PostAllProps = {
  take?: number | undefined
  skip?: number | undefined
}

export type PostCreateProps = {
  authorId: string
  content: string
}

export type PostEngageProps = {
  postid: string
  userid: string
}

export type PostCommentProps = {
  content: string
  commentId: string
  authorId: string
}

export type PostWithAuthorLikes = Post & {
  author: User
  likes: Like[]
}
export const PostWithAuthorLikesInclude = {
  author: true,
  likes: true,
}

/**
 * @property id: string;
 * @property createdAt: Date;
 * @property updatedAt: Date;
 * @property visible: boolean;
 * @property content: string | null;
 * @property shareId: string | null;
 * @property commentId: string | null;
 * @property authorId: string;
 * @property share: User & PostWithAuthorLikes
 */
export type PostWithShare = Post & {
  share: ShareWithAuthorPost
}

export const PostWithAuthorLikesSharesInclude = {
  ...PostWithAuthorLikesInclude,
  shares: {
    include: ShareWithAuthorPostInclude
  }
}
export type PostWithAuthorShares = PostWithAuthorLikes & PostWithShare

/**
 * Post & {
    author: User;
    likes: Like[];
} & {
    share: ShareWithAuthorPost[];
} & {
    shares: ShareWithAuthorPost[];
    post_comments: PostWithAuthorLikes[];
}
 */
export const PostWithDetailsInclude = {
  ...PostWithAuthorLikesSharesInclude,
  post_comments: {
    include: PostWithAuthorLikesInclude
  }
}
export type PostWithDetails = PostWithAuthorShares & {
  shares: ShareWithAuthorPost[]
  post_comments: PostWithAuthorLikes[]
}
