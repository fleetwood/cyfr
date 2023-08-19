import {Article, CommentThread, CommentThreadStub, CreatorStub, LikeStub, Review, ShareStub} from "prisma/prismaContext";

export type ArticleStub = Article & {
  creator:        CreatorStub
  shares:         ShareStub[]
  likes:          LikeStub[]
  review?:        Review
  commentThread?: CommentThread & {
    comments:     (Comment & {
      creator: CreatorStub
    })[]
    _count: {
      comments: number
    }
  }
  _count: {
    likes:  number
    shares: number
  }
}

export const ArticleInclude = {
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
  shares: {
    select: {
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
    skip: 0
  },
  likes: {
    select: {
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
    skip: 0
  },
  review: {
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
      shares: {
        select: {
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
        skip: 0
      },
      likes: {
        select: {
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
        skip: 0
      },
    },
  },
  commentThread: {
    include: {
      comments: {
        take: 10,
        skip: 0
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  },
  _count: {
    select: {
      shares: true,
      likes: true,
    },
  },
}