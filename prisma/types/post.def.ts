import { Agent } from "http"
import { Artist, Author, Book, BookFeedInclude, BookStub, BookStubInclude, Character, CharacterStub, Comment, CommentThread, CommentThreadStub, CommentThreadStubInclude, Cover, CoverStub, CreatorAndLikesAndCount, CreatorStub, CreatorStubInclude, Gallery, GalleryFeedInclude, GalleryStub, GalleryStubInclude, Image, ImageFeed, ImageFeedInclude, ImageStub, ImageStubInclude, Like, LikeStub, LikesAndCount, LikesAndCountsInclude, LikesCountInclude, LikesInclude, Membership, Post, User, UserStub, UserStubSelect } from "prisma/prismaContext"

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

export type SharedPostStub = Post & {
  _count: {
    likes: Number
  },
  creator:        UserStub
  images:         ImageFeed[]
  commentThread:  CommentThreadStub
}

export const SharedPostFeedInclude = {
  post: {
    include: {
      _count: {
        select: {
          likes: true
        }
      },  
      creator: {
        select: UserStubSelect
      },
      ...ImageFeedInclude,
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
    }
  },
}

type PostComments = Post & {
  creator: User
}

export type PostStub = Post & {
  _count: {
    likes: Number
  }
  creator:        UserStub
  images:         ImageFeed[]
  commentThread:  CommentThreadStub
  likes:          LikeStub[]
  image?:         ImageStub
  gallery?:       GalleryStub
  book?:          Book & {
    agent?:         Agent
    artists:        Artist[]
    authors:        (Author & {
      user:         User
    })[]
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
  cover?:         Cover & {
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
  post:           SharedPostStub
}

export const PostStubInclude = {
  // images: ImageFeedInclude,
  // // SHARES
  // image: ImageFeedInclude,
  // post: SharedPostFeedInclude,
  // gallery: GalleryFeedInclude,
  // book: BookFeedInclude,
  _count: {
    select: {
      likes: true
    }
  },
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
      creator: true,
      images: {
        include: {
        _count: {
          select: {
            likes: true,
            shares: true
          }
        }}
      },
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
      authors: {
        include: {
          user: true
        }
      },
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
    },
  },
  ...SharedPostFeedInclude
}

export type PostDetail = Post & CreatorAndLikesAndCount & {
  // This is a shared post, not the main post
  post?: Post & CreatorAndLikesAndCount
  images:  (Image & {
    likes: (Like & CreatorAndLikesAndCount)[]
  })[]
  book?: BookStub,
  character?: Character & CreatorAndLikesAndCount
  image?: Image & CreatorAndLikesAndCount
  commentThread: CommentThread & {
    comments: (Comment & CreatorAndLikesAndCount)[]
  }
}

export const PostDetailInclude = {
  _count: {
    select: {
      likes: true,
    },
  },
  creator: {
    include: {
      membership: true,
      blocks: true,
      isBlocked: true
    }
  },
  likes: {
    include: {
      creator: {
        select: {
          name: true,
          id: true,
          image: true,
          slug: true
        }
      }
    },
    take: 10
  },
  images: {
    include: {
      likes: {
        include: {
          creator: {
            select: {
              name: true,
              id: true,
              image: true,
              slug: true
            }
          }
        },
        take: 10
      },
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  },
  commentThread: {
    include: {
      comments: {
        take: 10
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
  book: {...BookStubInclude}
}
