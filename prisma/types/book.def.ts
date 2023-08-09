import { UseQueryResult } from "react-query"
import { Agent, AgentStub, AgentStubInclude, Artist, ArtistStub, ArtistStubInclude, Author, AuthorStub, AuthorStubInclude, Book, BookCategory, BookStatus, ChapterListItem, ChapterStub, CharacterStub, CommentThread, Cover, CoverStub, CoverStubInclude, CyfrUser, Follow, Gallery, GalleryStub, GalleryStubInclude, Genre, Image, Permission, Publisher, User, UserFollow, UserStub, UserStubSelect } from "../prismaContext"

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
  id?:          string
  title:        string
  slug?:        string
  completeAt?:  Date
  visible:      boolean
  fiction:      boolean
  prospect:     boolean
  genreId:      string
  status?:      BookStatus
  back?:        string
  hook?:        string
  synopsis?:    string
  words?:       number
  categories?:  BookCategory[]
  authors:      AuthorStub[]
  // permission:   Permission
}

export type BookCreateProps = {
  ownerId:      string
  genreId:      string
  coverId:      string
  authors:      Author[]
  title:        string
  visible:      boolean
  fiction:      boolean
  prospect:     boolean
  status:       BookStatus
  completeAt?:  Date
  back?:        string
  hook?:        string
  synopsis?:    string
  permission:   Permission
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
  agent?:       Agent
  authors:      AuthorStub[]
  artists:      Artist[]
  publisher?:   Publisher
  genre:        Genre
  gallery?:     Gallery
  cover?:       Cover
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
  agent:      true, // AgentStubInclude, // No stubs in stubs!
  authors:    {include: {
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
        authors:    true, // AuthorStubInclude,
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
  }}, // AuthorStubInclude,
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
  agent:      {include: { user: { select: {id: true,name: true,image: true,slug: true}}}},
  authors:      {include: { user: { select: {id: true,name: true,image: true,slug: true}}}},
  artists:      {include: { user: { select: {id: true,name: true,image: true,slug: true}}}},
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
  cover: { include: {
    image: true,
    creator: {
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
        membership: true
      }
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
        shares: true
      }
    }
  }},
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