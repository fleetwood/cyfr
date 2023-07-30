import { CommentThread, CreatorStub, Gallery, GalleryStub, GalleryStubInclude, Image, LikesCountInclude, LikesInclude, PostStub, PostStubInclude, User, UserStub, UserStubSelect } from "prisma/prismaContext"

export type ImageUpsertProps = {
  id?:              string
  creatorId:         string
  url:              string
  visible:          boolean
  height:           number
  width:            number
  title?:           string | null
  galleryId?:       string | null
  postId?:          string | null
  commentThreadId?: string | null
}

export type ImageDeleteProps = {
  imageId: string
  creatorId: string
}

export type ImageEngageProps = {
  imageId: string
  creatorId: string
}

export type ImageStubViewProps = {
  image?:     ImageStub
  onClick?:   (image: ImageStub) => any
  className?: string
}

export type ImageFeed = Image & {
  creator: UserStub
  galleryId?: string
  postId?: string
}

export const ImageFeedInclude = {
  include: {
    creator: {
      select: {
        name: true,
        email: true,
        slug: true,
        image: true
      }
    },
    gallery: true
  }
}

export type ImageStub = Image & {
  likes: UserStub[]
  gallery: Gallery
  // post: PostStub
  creator: CreatorStub
  _count: {
    likes: number
  }
  commentThread?: CommentThread & {
    comments: (Comment & {
      creator: User
    })[]
  }
}

export const ImageStubInclude = { include : {
  creator: {select: UserStubSelect},
  gallery: true,
  // post: {include: {
  //     creator: true,
  //     ...LikesCount
  // }},
  _count: {
    select: {
      likes: true
    }
  },
  commentThread: {
    include: {
      comments: {
        include: {
          creator: true
        }
      }
    }
  }
}}

export type ImageDetail = ImageStub & {
  gallery?: GalleryStub
  post?: PostStub
}

export const ImageDetailInclude = {
  creator: true,
  likes: {
    include: {
      creator: true,
    },
  },
  post: true,
  gallery: {
    include: {
      creator: true,
      likes: {
        include: {
          creator: true,
        },
      }
    },
  },
}
