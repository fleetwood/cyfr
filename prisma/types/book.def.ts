import { UseQueryResult } from "react-query"
import { Agent, AgentStub, AgentStubInclude, Artist, ArtistStub, ArtistStubInclude, Author, AuthorStub, AuthorStubInclude, Book, BookCategory, BookStatus, ChapterListItem, ChapterStub, CharacterStub, CommentThread, Cover, CoverStub, CoverStubInclude, CyfrUser, Follow, GalleryStub, Genre, Image, Publisher, User, UserFollow, UserStub } from "../prismaContext"

export type BookRelations = {
  genre:        Genre
  authors:      UserStub[]
  gallery?:     GalleryStub
  cover?:       CoverStub
  follows?:     UserFollow[]
  likes?:       UserStub[]
  shares?:      UserStub[]
  chapters?:    ChapterStub[]
  characters?:  CharacterStub[]
  categories?:  BookCategory[]
}

export type BookUpsertProps = {
  ownerId:      string
  id?:          string|null
  title:        string
  slug?:        string
  completeAt?:  Date|null
  visible:      boolean
  fiction:      boolean
  prospect:     boolean
  genreId:      string
  status?:      BookStatus|null
  back?:        string
  hook?:        string
  synopsis?:    string
  words?:       number
  categories?:  BookCategory[] | null
  authors?:      User[]|CyfrUser[]
}

export type BookCreateProps = {

}

export type BookEngageProps = {
  bookId: string,
  creatorId: string
}

/**
 * @param book {@link Book} The Book that the Cover is being added to
 * @param cover {@link Cover} Connect to an existing Cover
 * @param newImage {@link Image} Uploading a new image as the cover
 * @param imageId {@link Image} String for the id of an existing Cover's image
 */
export type ChangeCoverProps = {
  book:       Book
  cover?:     Cover
  newImage?:  Image
  imageId?:   string
}

export type ChangeGenreProps = {
  bookId: string
  genreId: string
}

// TODO This does not account for startedAt and completeAt bc @#$@#$ Date -> String
export type BookApiUpdate = {
  props: {
    title?:       string | null
    active?:      boolean
    prospect?:    boolean
    fiction?:     boolean
    status?:      BookStatus
    back?:        string | null
    synopsis?:    string | null
    hook?:        string | null
    genreId?:     string | null
  }
  autoSave?:      boolean
}

export type BookDetailHook = BookDetail & {
  bookDetail:   BookDetail | null
  query:        UseQueryResult<any, any> & {
    invalidate: () => void
  }
  api:          any
}

export const BookFeedInclude = {
  include: {
    gallery: true,
    cover: true,
    agent: {
      include: {
        user: true
      }
    },
    authors: {
      include: {
        user: true
      }
    },
    artists: {
      include: {
        user: true
      }
    },
    reviews: {
      include: {
        creator: true
      }
    },
    _count: {
      select: {
        chapters: true,
        characters: true,
        readers: true,
        reviews: true
      }
    }
  }
}

export type BookStub = Book & {
  agent?:       AgentStub
  authors:      AuthorStub[]
  artists:      ArtistStub[]
  publisher?:   Publisher
  genre:        Genre
  gallery?:     GalleryStub
  cover?:       Cover // CoverStub
  _count: {
    chapters:   number
    characters: number
    likes:      number
    shares:     number
    follows:    number
    readers:    number
    reviews:    number
  }
}

export const BookStubInclude = { include: {
  agent:      AgentStubInclude,
  authors:    AuthorStubInclude,
  artists:    ArtistStubInclude,
  publisher:  true,
  genre:      true,
  gallery:    true,
  cover: {
    include: {
      image: true,
      artists: true
    }
  },
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
}}

export type BookDetail = Book & {
  agent?:         AgentStub
  authors:        AuthorStub[]
  artists:        ArtistStub[]
  publisher?:     Publisher
  genre:          Genre
  gallery?:       GalleryStub
  cover?:         CoverStub
  chapters:       ChapterListItem[]
  characters: {
    id:         string
    name:       string
    thumbnail:  string
  }[]
  follows:        UserFollow[]
  commentThread?: CommentThread & {
    comments:     Comment[]
  }
  _count: {
    likes:      number
    shares:     number
    follows:    number
    readers:    number
    reviews:    number
  }
}

export const BookDetailInclude = { include: {
  agent:      AgentStubInclude,
  authors:    AuthorStubInclude,
  artists:    ArtistStubInclude,
  publisher:  true,
  genre:      true,
  gallery:    true,
  chapters: {
    select: {
      id: true,
      order: true,
      title: true,
      words: true
    }
  },
  characters: {
    select: {
      id: true,
      name: true,
      thumbnail: true
    }
  },
  cover: CoverStubInclude,
  follows: {
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          image: true,
          slug: true,
        }
      },
    },
    take: 10
  },
  commentThread: {
    include: {
      comments: {
        take: 10
      }
    }
  },
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
}}