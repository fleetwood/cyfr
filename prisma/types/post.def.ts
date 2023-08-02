import {
  CommentThreadStub,
  CommentThreadStubInclude,
  CreatorSharesLikes,
  CreatorStubSelect,
  Image,
  Post,
  PostImage,
  PostImageInclude,
  ShareStub,
  User
} from 'prisma/prismaContext'

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
  postId: string
}

export type PostCommentProps = {
  postId?: string
  creatorId: string
  content: string
}

export const PostBaseInclude = {
  creator: true,
  comment: true,
  commentThread: true,
  likes: true,
  shares: true,
}

export type SharedPostStub = Post & CreatorSharesLikes & {
  _count: {
    likes:  number
    shares: number
  }
  images: PostImage[]
  commentThread: CommentThreadStub
}

export const SharedPostFeedInclude = { include: {
  creator: { select: {
    id: true,
    name: true,
    image: true,
    slug: true,
    membership: true,
  }},
  likes: { include: {
    creator: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true,
    }}},
    take: 10,
  },
  shares: { include: {
    creator: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true,
    }}},
    take: 10,
  },
  _count: {
    select: {
      likes: true,
      shares: true,
    },
  },
  commentThread: { include: {
    comments: {
      include: {
        creator: CreatorStubSelect
      },
      take: 10
    },
    commune: true,
    blocked: true,
    _count: {
      select: {
        comments: true
      }
    },
  }}
}}

type PostComments = Post & {
  creator: User
}

export type PostStub = Post & CreatorSharesLikes & {
  _count: {
    likes: number
    shares: number
  }
  images: PostImage[]
  commentThread: CommentThreadStub
  share?: ShareStub
}

export const PostStubInclude = { include: {
  creator: {
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true,
    },
  },
  likes: {
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
          slug: true,
          membership: true,
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
          membership: true,
        },
      },
    },
    take: 10,
  },
  share: { include: {
    creator: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: true,
    }},

    // INCLUDE SHARED BOOK
    book: {
      include: {
        likes: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                image: true,
                slug: true,
                membership: true,
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
                membership: true,
              },
            },
          },
          take: 10,
        },
        authors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                membership: true,
              },
            },
          },
        },
        cover: {
          include: {
            image: true,
            _count: {
              select: {
                likes: true,
                shares: true,
              },
            },
          },
        },
        characters: true,
        chapters: {
          where: {
            visible: true,
          },
          select: {
            order: true,
            title: true,
            reads: true,
            words: true,
          },
        },
        _count: {
          select: {
            likes: true,
            shares: true,
          },
        },
      },
    },

    // INCLUDE SHARED COVER
    cover: {
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            membership: true,
          },
        },
        likes: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                image: true,
                slug: true,
                membership: true,
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
                membership: true,
              },
            },
          },
          take: 10,
        },
        image: { include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
              membership: true,
            },
          },
          likes: {
            include: {
              creator: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  slug: true,
                  membership: true,
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
                  membership: true,
                },
              },
            },
            take: 10,
          },
        }},
        _count: {
          select: {
            likes: true,
            shares: true,
          },
        },
      },
    },

    // INCLUDE SHARED POST
    post: SharedPostFeedInclude,
  }},
  images: PostImageInclude,
  commentThread: { include: {
    comments: {
      include: {
        creator: CreatorStubSelect
      },
      take: 10
    },
    commune: true,
    blocked: true,
    _count: {
      select: {
        comments: true
      }
    },
  }},
  _count: {
    select: {
      likes: true,
      shares: true
    }
  }
}}

// TODO
export type PostDetail = PostStub

// TODO
export const PostDetailInclude = PostStubInclude