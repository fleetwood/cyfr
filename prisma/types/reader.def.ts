import { BookStub, Reader, Review, UserStub } from 'prisma/prismaContext'

export type ReaderDetail = Reader & {
  user: UserStub,
  _count: {
    books: number
  }
}

export type ReaderStub = Reader & {
  user:     UserStub
  books:    BookStub[]
  reviews:  Review[]
  _count: {
    books:    number
    reviews:  number
  }
}

export const ReaderStubInclude = {include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
      },
    },
    books: {
      include: {
        agent:      true, // AgentStubInclude, // No stubs in stubs!
        readers:    true, // ReaderStubInclude,
        artists:    true, // ArtistStubInclude,
        publisher:  true,
        genre:      true,
        gallery:    true, // GalleryStubInclude,
        cover: true, // 
        // {
        //   include: {
        //     image: true,
        //     artists: true
        //   }
        // },
        _count: {
          select: {
            chapters: true,
            characters: true,
            likes: true,
            shares: true,
            follows: true,
            readers: true,
            reviews: true
          }
        }
      },
      take: 5
    },
    reviews: {
      take: 5
    },
    _count: {
      select: {
        books: true,
        reviews: true
      }
    }
}}
