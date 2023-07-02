import { Book, Character, CommentThread, Counts, CountsInclude, Cover, Gallery, Image, ImageFeed, Like, Post, User } from "./../prismaContext"
import { ImageFeedInclude } from "./image.def"
import { UserFeed, UserFeedInclude, UserStub } from "./user.def"

export type PostCreateProps = {
  content: string
  creatorId: string
  images?: Image[]
}

export type PostDeleteProps = {
  postId: string
  creatorId: string
}

export type PostEngageProps = {
  creatorId: string
  postId:   string
}

export type PostCommentProps = {
  postId?:    string
  creatorId:   string
  content:    string
}

export const PostBaseInclude = {
  creator: true,
  comment: true,
  commentThread: true,
  likes: true,
  shares: true,
}

type PostComments = Post & {
  creator: User
}

export type PostStub = Post & Counts & {
  creator:        UserStub
  images:         ImageFeed[]
  commentThread:  CommentThread & {
    comments:     Comment[]
  }
  likes:          Like & {
    creator:      User
  }[]
  // SHARES
  sharedPost:     Post
  image:          Image
  gallery:        Gallery
  book:           Book
  character:      Character
  cover:          Cover
}

export const PostStubInclude = {
  creator: true,
  images: {
    include: {
      _count: {
        select: {
          likes: true
        }
      }
    }
  },
  commentThread: { include: { comments: true } },
  likes: {
    include: {
      creator: true
    },
    take: 10
  },
  // SHARES
  sharedPost: true,
  image: true,
  gallery: true,
  book: true,
  character: true,
  cover: true,
  ...CountsInclude
}

export const PostFeedInclude = PostStubInclude

export type PostDetail = Post & {
  createdat?: string
  updatedat?: string
  creator: UserFeed
  commentThread: CommentThread & {
    comments: Comment[]
  }
  likes: UserStub[]
  images: ImageFeed[]
}

export const PostDetailInclude = {
  creator: { include: UserFeedInclude },
  commentThread: { include: { comments: true } },
  likes: { include: { creator: true } },
  images: { include: ImageFeedInclude },
}
