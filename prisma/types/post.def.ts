import { Agent } from "http"
import { Artist, Author, Book, BookFeedInclude, BookStub, Character, CharacterStub, Comment, CommentThread, CommentThreadStub, CommentThreadStubInclude, Cover, CoverStub, CreatorStub, CreatorStubInclude, Gallery, GalleryFeedInclude, GalleryStub, Image, ImageFeed, ImageFeedInclude, ImageStub, ImageStubInclude, Like, LikesAndCount, LikesAndCountsInclude, LikesCountInclude, LikesInclude, Membership, Post, User, UserStub } from "prisma/prismaContext"

export type PostCreateProps = {
  content: string
  creatorId: string
  images?: Image[]
}

export type PostDeleteProps = {
  postId: string
  creatorId: string
}

export type PostEngageProps = {
  creatorId: string
  postId:   string
}

export type PostCommentProps = {
  postId?:    string
  creatorId:   string
  content:    string
}

export const PostBaseInclude = {
  creator: true,
  comment: true,
  commentThread: true,
  likes: true,
  shares: true,
}

type PostComments = Post & {
  creator: User
}

export type PostStub = Post & LikesAndCount & {
  creator:        UserStub
  images:         ImageFeed[]
  commentThread:  CommentThreadStub
  // SHARES
  post?:          Post
  image?:         Image & {
    creator:        User
    cover:          Cover
    _count: {
      likes: number,
      shares: number
    }
  }
  gallery?:       Gallery & {
    images:         Image[]
    _count: {
      likes: number,
      shares: number
    }
  }
  book?:          Book & {
    agent?:         Agent
    artists:        Artist[]
    authors:        Author[]
    cover:          Cover & {
      image:          Image,
      artists:        Artist[]
    },
    _count: {
      chapters:   number,
      characters: number,
      likes:      number,
      shares:     number,
      readers:    number,
      reviews:    number
    }
  }
  character?:     Character & {
    books:          Book[]
    gallery?:       Gallery
    _count: {
      likes:  number
      shares: number
    }
  }
  cover?:          Cover & {
    image:          Image,
    artists:        Artist[]
    _count: {
      chapters:   number,
      characters: number,
      likes:      number,
      shares:     number,
      readers:    number,
      reviews:    number
    }
  }
}

export const PostStubInclude = {
  // images: ImageFeedInclude,
  // // SHARES
  // image: ImageFeedInclude,
  // post: SharedPostFeedInclude,
  // gallery: GalleryFeedInclude,
  // book: BookFeedInclude,
  ...LikesInclude,
  ...LikesCountInclude,
  creator: {
    include: {
      membership: true,
      blocks: true,
      isBlocked: true
    }
  },
  images: true,
  commentThread: {
    include: {
      comments: {
        take: 10,
        // orderBy: {
        //   createdAt: 'desc'
        // }
      },
      commune: true,
      blocked: true,
      _count: {
        select: {
          comments: true
        }
      },
    },
  },
  gallery: {
    include: {
      images: true,
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  },
  character: {
    include: {
      books: true,
      gallery: true,
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  },
  image: {
    include: {
      creator: true,
      cover: true,
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  },
  book: {
    include: {
      agent: true,
      artists: true,
      authors: true,
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
          readers: true,
          reviews: true
        }
      }
    }
  }
}

export const SharedPostFeedInclude = { include: {
    creator: true,
    images: {include: {
      creator: {
        select: {
          name: true,
          email: true,
          slug: true,
          image: true
        }
      },
      gallery: true
    }},
    commentThread: { include: { comments: true } },
    ...LikesInclude,
    ...LikesCountInclude
}}

export const SharedPostInclude = {
  creator: true,
  images: {include: {
    creator: {
      select: {
        name: true,
        email: true,
        slug: true,
        image: true
      }
    },
    gallery: true
  }},
  commentThread: { include: { comments: true } },
  ...LikesInclude,
  ...LikesCountInclude
}

type CreatorAndLikesAndCount = CreatorStub & LikesAndCount

export type PostDetail = Post & CreatorAndLikesAndCount & {
  post?: Post & CreatorAndLikesAndCount
  images?:  (Image & CreatorAndLikesAndCount)[]
  book?: Book & CreatorAndLikesAndCount,
  character?: Character & CreatorAndLikesAndCount
  image?: Image & CreatorAndLikesAndCount
  commentThread: CommentThread & {
    comments: (Comment & CreatorAndLikesAndCount)[]
  }
}

const CreatorLikesCountInclude = {include: {...CreatorStubInclude,...LikesAndCountsInclude}}

export const PostDetailInclude = {
  ...CreatorStubInclude,
  post: CreatorLikesCountInclude,
  images: CreatorLikesCountInclude,
  book: CreatorLikesCountInclude,
  character: CreatorLikesCountInclude,
  image: CreatorLikesCountInclude,
  commentThread: { include: { comments: CreatorLikesCountInclude } },
  ...LikesAndCountsInclude
  // ...LikesInclude,
  // ...LikesCount,
}
