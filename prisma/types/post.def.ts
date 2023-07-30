import { Agent } from "http"
import { Artist, Author, Book, BookStub, BookStubInclude, Character, Comment, CommentThread, CommentThreadStub, Cover, CreatorAndLikesAndCount, CreatorStub, Gallery, GalleryStub, Image, ImageFeed, ImageFeedInclude, ImageStub, Like, LikeStub, Post, ShareStub, User, UserStub, UserStubSelect } from "prisma/prismaContext"

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
    likes:    Number
    shares:   Number
  }
  creator:        CreatorStub
  images:         ImageFeed[]
  commentThread:  CommentThreadStub
  likes:          LikeStub[]
  shares:         ShareStub[]
  share?:         ShareStub
}

export const PostStubInclude = {
  // images: ImageFeedInclude,
  // // SHARES
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
}

export type PostDetail = Post & CreatorAndLikesAndCount & {
  // This is a shared post, not the main post
  post?: Post & CreatorAndLikesAndCount
  images:  (Image & {
    likes: (Like & CreatorAndLikesAndCount)[]
  })[]
  book?: BookStub,
  cover?:         Cover & {
    image:          ImageStub,
    artists:        Artist[]
    _count: {
      likes:      number,
      shares:     number,
    }
  }
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
  book: {...BookStubInclude},
  cover:
  {
    include: {
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
      artists: true,
      _count: {
        select: {
        likes:      true,
        shares:     true
      }}
    }
  }
}
