import { Post, User } from "@prisma/client"
import { ResponseResult } from "../../types/response";

export type PostsResponse = ResponseResult<Post[]>;
export type PostResponse = ResponseResult<Post>;

export type PostAllProps = {
  take?: number | undefined
  skip?: number | undefined
}

export type PostCreateProps = {
  authorid: string
  content: string
}

export type PostEngageProps = {
  postid: string
  userid: string
}

export type PostCommentProps = {
  content: string
  commentId: string
  authorid: string
}

export type PostWithAuthor = Post & {
  author: User
  likes: User[]
}
export const PostWithAuthorInclude = {
  author: true,
  likes: true,
}

export type ShareWithAuthor = Post & {
  share:
    | (PostWithAuthor & {
        post_shares: PostWithAuthor[]
      })
    | null
}
export const ShareWithAuthorInclude = {
  share: {
    include: {
      ...PostWithAuthorInclude,
      post_shares: {
        include: PostWithAuthorInclude,
      },
    },
  },
}

export const PostWithAuthorSharesInclude = {
  ...PostWithAuthorInclude,
  ...ShareWithAuthorInclude,
}
export type PostWithAuthorShares = PostWithAuthor & ShareWithAuthor

export const PostWithDetailsInclude = {
  ...PostWithAuthorSharesInclude,
  post_shares: {
    include: PostWithAuthorSharesInclude,
  },
}
export type PostWithDetails = PostWithAuthorShares & {
  post_shares: PostWithAuthorShares[]
}
