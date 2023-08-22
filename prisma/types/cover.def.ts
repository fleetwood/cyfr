import {ArtistStub,CommentThreadStub,Cover,CreatorSharesLikes,Genre,Image} from "prisma/prismaContext"

export type CoverUpsertProps = {
  id?:          string
  creatorId:    string
  imageId:      string
  bookId?:      string
  genreId?:     string
  visible?:     boolean
  exclusive?:   boolean
  description?: string
}

export type CoverDeleteProps = {
  coverId: string
  creatorId: string
}

export type CoverEngageProps = {
  coverId: string
  creatorId: string
}

export type CoverStubViewProps = {
  cover?:     CoverStub
  onClick?:   (cover: CoverStub) => any
  className?: string
}

export type CoverStub = Cover & CreatorSharesLikes & {
  image:    Image
  artists:  ArtistStub[]
  genre?:   Genre
  commentThread: CommentThreadStub
  _count: {
    likes:  number
    shares: number
  }
}

export const CoverStubInclude = {include: {
    image: true,
    creator: {
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        membership: {
          include: {
            type: true,
          },
        },
      },
    },
    likes: {
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            membership: {
              include: {
                type: true,
              },
            },
          },
        },
      },
      take: 10,
    },
    shares: {
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            membership: {
              include: {
                type: true,
              },
            },
          },
        },
      },
      take: 10,
    },
    artists: {
      include: {
        user: {
          select: {
            name: true,
            id: true,
            slug: true,
            image: true,
          },
        },
      },
    },
    genre: true,
    _count: {
      select: {
        likes: true,
        shares: true,
      },
    },
  },
}

export type CoverDetail = CoverStub & {
}

export const CoverDetailInclude = CoverStubInclude
