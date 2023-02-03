import { Like, Post, Share, User } from "./../prismaContext";

export type PostCreateProps = {
  content: string
  authorId: string
}

export type PostDeleteProps = {
  postId: string
  authorId: string
}

export type PostEngageProps = {
  authorId: string
  postId: string
}

export type PostCommentProps = {
  commentId: string
  authorId: string
  content: string
}

export type PostBase = Post & {
  author: User
  comment?: Post
  post_comments: Post[]
  likes: Like[]
  shares: Share[]
}

export const PostBaseInclude = {
  author: true,
  comment: true,
  post_comments: true,
  likes: true,
  shares: true
}

type PostComments = Post & {
  author: User,
}

export type PostFeed = Post & {
  author: User
  comment?: Post
  post_comments: PostComments[]
  likes: Like & {author: User}[]
  shares: Share & {author: User}[]
}

export const PostFeedInclude = {
  author: {
    // counts only
    include: { _count: { select: { 
      posts: true,
      fans: true,
      fanOf: true,
      follower: true,
      following: true 
    }}}
  },
  comment: {
    where: {
      visible: true
    },
    include: {
      author: true
    }
  },
  post_comments: true,
  likes: true,
  shares: true
}

export type PostDetail = Post & {
  author: User
  comment?: Post
  post_comments: Post[]
  likes: Like[]
  shares: Share[]
}

export const PostDetailInclude = {
  author: {
    // counts only
    include: { _count: { select: { 
      posts: true,
      fans: true,
      fanOf: true,
      follower: true,
      following: true 
    }}}
  },
  comment: {
    where: {
      visible: true
    },
    include: {
      author: true
    }
  },
  post_comments: true,
  likes: true,
  shares: true
}