import {
  CommentThreadStub,
  CommentThreadStubInclude,
  CreatorSharesLikes,
  CreatorSharesLikesInclude,
  CreatorStub,
  CreatorStubSelect,
  Image,
  ImageFeedInclude,
  LikeStub,
  Post,
  PostImage,
  PostImageInclude,
  ShareList,
  ShareListInclude,
  ShareStub,
  ShareStubInclude,
  User,
  UserStub,
  UserStubSelect
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

export type SharedPostStub = Post & {
  _count: {
    likes: Number
  }
  creator: UserStub
  images: PostImage[]
  commentThread: CommentThreadStub
}

export const SharedPostFeedInclude = { include: {
  _count: {
    select: {
      likes: true,
      shares: true,
    },
  },
  creator: CreatorStubSelect,
  commentThread: CommentThreadStubInclude
}}

type PostComments = Post & {
  creator: User
}

export type PostStub = Post & CreatorSharesLikes & {
  _count: {
    likes: Number
    shares: Number
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
  commentThread: CommentThreadStubInclude,
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