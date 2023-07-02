import { BookFeedInclude, BookStub, BookStubInclude, CharacterStub, CharacterStubInclude, CommentThread, CoverStub, CoverStubInclude, GalleryFeedInclude, GalleryStub, GalleryStubInclude, Image, ImageFeed, ImageFeedInclude, ImageStub, ImageStubInclude, Like, LikesCount, LikesInclude, Post, User, UserStub, UserStubSelect } from "prisma/prismaContext"

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

export type PostStub = Post & LikesCount & {
  creator:        UserStub
  images:         ImageFeed[]
  commentThread:  CommentThread & {
    comments:     Comment[]
  }
  // SHARES
  post?:          Post
  image?:         ImageStub
  gallery?:       GalleryStub
  book?:          BookStub
  character?:     CharacterStub
  cover?:         CoverStub
}

export const SharedPostFeedInclude = { include: {
    creator: true,
    images: {include: {
      creator: {
        select: {
          name: true,
          email: true,
          slug: true,
          image: true
        }
      },
      gallery: true
    }},
    commentThread: { include: { comments: true } },
    ...LikesInclude,
    ...LikesCount
}}

export const SharedPostInclude = {
  creator: true,
  images: {include: {
    creator: {
      select: {
        name: true,
        email: true,
        slug: true,
        image: true
      }
    },
    gallery: true
  }},
  commentThread: { include: { comments: true } },
  ...LikesInclude,
  ...LikesCount
}

export const PostStubInclude = {
  creator: true,
  images: ImageFeedInclude,
  // SHARES
  image: ImageFeedInclude,
  post: SharedPostFeedInclude,
  gallery: GalleryFeedInclude,
  book: BookFeedInclude,
  ...LikesInclude,
  ...LikesCount,
}

export type PostDetail = Post & {
  createdat?: string
  updatedat?: string
  creator: UserStub
  commentThread: CommentThread & {
    comments: Comment[]
  }
  likes: UserStub[]
  images: ImageFeed[]
}

export const PostDetailInclude = {
  creator: { select: UserStubSelect },
  commentThread: { include: { comments: true } },
  images: { include: ImageFeedInclude },
  ...LikesInclude,
  ...LikesCount,
}
