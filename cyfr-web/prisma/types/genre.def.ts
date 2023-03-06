import { Book, BookCategory, Chapter, Character, Follow, Gallery, Genre, Like, User, UserFeed } from "../prismaContext"

export type GenreFeed = Genre & {
    books: Book & {
        categories: BookCategory[]
        authors: User[]
        chapters: Chapter[]
        characters: Character[],
        gallery: Gallery[],
        fans: Follow[],
        likes: Like[]
    }[]
}

export const GenreFeedInclude = {
    books:{
        include: {
          authors: {
            include: {
              membership: true,
              blocked: true,
              _count: {
                select: {
                  books: true,
                  fanOf: true,
                  fans: true,
                  posts: true,
                  follower: true,
                  following: true,
                  sessions: true,
                  likes: true,
                  shares: true
                }
              }
            }
          },
          categories: true,
          chapters: true,
          characters: true,
          gallery: true,
          likes: true
        }
      }
}