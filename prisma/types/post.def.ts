import { Book, BookFeedInclude, BookStub, Character, CharacterStub, Comment, CommentThread, CoverStub, CreatorStub, CreatorStubInclude, GalleryFeedInclude, GalleryStub, Image, ImageFeed, ImageFeedInclude, ImageStub, Like, LikesAndCount, LikesAndCountsInclude, LikesCountInclude, LikesInclude, Membership, Post, User, UserStub } from "prisma/prismaContext"

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

export type PostStub = Post & LikesAndCount & {
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
    ...LikesCountInclude
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
  ...LikesCountInclude
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
  ...LikesCountInclude,
}

type CreatorAndLikesAndCount = CreatorStub & LikesAndCount

export type PostDetail = Post & CreatorAndLikesAndCount & {
  post?: Post & CreatorAndLikesAndCount
  images?:  (Image & CreatorAndLikesAndCount)[]
  book?: Book & CreatorAndLikesAndCount,
  character?: Character & CreatorAndLikesAndCount
  image?: Image & CreatorAndLikesAndCount
  commentThread: CommentThread & {
    comments: (Comment & CreatorAndLikesAndCount)[]
  }
}

const CreatorLikesCountInclude = {include: {...CreatorStubInclude,...LikesAndCountsInclude}}

export const PostDetailInclude = {
  ...CreatorStubInclude,
  post: CreatorLikesCountInclude,
  images: CreatorLikesCountInclude,
  book: CreatorLikesCountInclude,
  character: CreatorLikesCountInclude,
  image: CreatorLikesCountInclude,
  commentThread: { include: { comments: CreatorLikesCountInclude } },
  ...LikesAndCountsInclude
  // ...LikesInclude,
  // ...LikesCount,
}
