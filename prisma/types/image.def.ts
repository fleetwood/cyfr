import {CommentThread,CreatorSharesLikes,CreatorStub,CreatorStubSelect,Gallery,GalleryStub,Image,LikeStub,PostStub,ShareStub,User} from "prisma/prismaContext"

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

export type ImageFeed = Image & {
  creator:    CreatorStub
  galleryId?: string
  postId?:    string
}

export const PostImageInclude = {include: {
  creator: { select: {
    id: true,
    name: true,
    image: true,
    slug: true,
    membership: { select: {
        id: true,
        expiresAt: true,
        type: {select: {
            id: true,
            name: true,
            level: true,
        }},
    }},
  }},
  _count: { select: {
    likes: true,
    shares: true
  }},
  likes: { include: {
    creator: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: { select: {
          id: true,
          expiresAt: true,
          type: {select: {
              id: true,
              name: true,
              level: true,
          }},
      }},
    }}
  }},
  shares: { include: {
    creator: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: { select: {
          id: true,
          expiresAt: true,
          type: {select: {
              id: true,
              name: true,
              level: true,
          }},
      }},
    }}
  }}
}}

export type PostImage = Image & CreatorSharesLikes & {
  _count: {
    likes:  number
    shares: number
  }
}

export const ImageFeedInclude = {include: {
  creator: CreatorStubSelect,
  gallery: true
}}

export type ImageStub = Image & {
  creator: CreatorStub
  likes: LikeStub[]
  shares: ShareStub[]
  _count: {
    likes: number
    shares: number
  }
  gallery: Gallery
  commentThread?: CommentThread & {
    comments: (Comment & {
      creator: User
    })[]
  }
}

export const ImageStubInclude = { include : {
  creator: CreatorStubSelect,
  _count: { select: {
    likes: true,
    shares: true
  }},
  likes: { include: {
    creator: CreatorStubSelect
  }},
  shares: { include: {
    creator: CreatorStubSelect
  }},
  gallery: true,
  commentThread: { include: {
    comments: { include: {
      creator: true
    }}
  }}
}}

export type ImageDetail = ImageStub & {
  gallery?: GalleryStub
  post?: PostStub
}

export const ImageDetailInclude = {
  creator: CreatorStubSelect,
  _count: { select: {
    likes: true,
    shares: true
  }},
  likes: { include: {
    creator: CreatorStubSelect
  }},
  shares: { include: {
    creator: CreatorStubSelect
  }},
  post: true,
  gallery: { include: {
    creator: CreatorStubSelect,
    _count: { select: {
      likes: true,
      shares: true
    }}
  }},
}
