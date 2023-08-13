import { Artist, Book, Cover, Gallery, Review, UserStub } from 'prisma/prismaContext'

export type ArtistDetail = Artist & {
  user: UserStub
  books: Book[]
  galleries: Gallery[]
  reviews: Review[]
  covers: Cover[]
  _count: {
    books:      number
    galleries:  number
    reviews:    number
    covers:     number
  }
}

export const ArtistDetailInclude = {include: {
  user: {
    select: {
      name: true,
      id: true,
      slug: true,
      image: true,
    },
  },
  books: {
    take: 5
  },
  galleries: {
    take: 5
  },
  reviews: true,
  covers: {
    take: 5
  },
  _count: {
    books: true,
    galleries: true,
    reviews: true,
    covers: true
  }
}}

export type ArtistStub = Artist & {
  user: UserStub
  books: Book[]
  galleries: Gallery[]
  reviews: Review[]
  covers: Cover[]
  _count: {
    books:      number
    galleries:  number
    reviews:    number
    covers:     number
  }
}

export const ArtistStubInclude = {
  include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
        membership: {
          select: {
            id: true,
            expiresAt: true,
            type: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
      },
    },
    books: {
      take: 5,
    },
    galleries: {
      take: 5,
    },
    reviews: true,
    covers: {
      take: 5,
    },
    _count: {
      select: {
        books: true,
        galleries: true,
        covers: true,
        reviews: true,
      },
    },
  },
}
