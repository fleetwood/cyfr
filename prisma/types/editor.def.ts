import { BookStub, Editor, Review, UserStub } from 'prisma/prismaContext'

export type EditorDetail = Editor & {
  user: UserStub,
  _count: {
    books: number
  }
}

export type EditorStub = Editor & {
  user:     UserStub
  books:    BookStub[]
  reviews:  Review[]
  _count: {
    books:    number
    reviews:  number
  }
}

export const EditorStubInclude = {include: {
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
        editors:    true, // EditorStubInclude,
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
