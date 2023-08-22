import {
  BookStub,
  BookStubInclude,
  ChapterStub,
  Character,
  CreatorSharesLikes,
  CyfrUser,
  Gallery,
  GalleryStub,
  GalleryStubInclude,
  UserFollow,
  UserStub
} from '../prismaContext'

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterStub = Character &
  CreatorSharesLikes & {
    authors: UserStub[]
    books: BookStub[]
    gallery: GalleryStub
    _count: {
      likes: true
      shares: true
    }
  }

// TODO: Stubs cannot include other stubs
export const CharacterStubInclude = {
  include: {
    likes: {
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
          slug: true,
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
    },
    take: 10,
  },
  shares: {
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
          slug: true,
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
    },
    take: 10,
  },
  creator: {
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
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
    authors: {
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
      },
    },
    books: BookStubInclude,
    gallery: GalleryStubInclude,
  },
  _count: {
    select: {
      shares: true,
      likes: true,
    },
  },
}

/**
 * @property characters {@link Character} TODO: should be a CharacterStub
 */
export type CharacterDetail = Character &
  CreatorSharesLikes & {
    follows?: UserFollow[]
    books?: BookStub[]
    chapters?: ChapterStub[]
    galleryId?: string
    gallery?: Gallery
    _count: {
      shares: string
      likes: string
    }
  }

export type CharacterUpsertProps = {
  id?: string
  updatedAt?: string
  active: boolean
  name: string
  familyName: string
  givenName: string
  middleName: string
  thumbnail: string
  age: string
  role: string
  description: string
  backstory: string
  title: string
  archetype: string
  bookId: string
}

export type CharacterApi = {
  save: (props: CharacterApiUpdate) => Promise<CharacterDetail | null>
  characterDetail: CharacterDetail | null
  isLoading: boolean
  error: any
  invalidate: () => void
}

export type CharacterApiProps = {
  characterDetail: CharacterDetail
  cyfrUser?: CyfrUser
}

export type CharacterApiUpdate = {
  id?: string
  updatedAt?: string
  active?: boolean
  name?: string
  familyName?: string
  givenName?: string
  middleName?: string
  thumbnail?: string
  age?: string
  role?: string
  description?: string
  backstory?: string
  title?: string
  archetype?: string
}
