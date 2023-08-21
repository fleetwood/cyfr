import {
  ArticleStubSelect,
  ArtistStubInclude,
  AuthorStubInclude,
  CommentThreadStub,
  CommentThreadStubInclude,
  CreatorSharesLikes,
  CreatorStub,
  CreatorStubSelect,
  Image,
  LikeStub,
  MembershipStubSelect,
  MembershipTypeStub,
  Post,
  PostImage,
  PostImageInclude,
  Share,
  ShareStub,
  User
} from 'prisma/prismaContext'


/**
 * Because this is not drilling down far enough into TS to find the {@link CreatorStubSelect}
 * 
 */
const PostCreatorSelect = { select: {
  id: true,
  name: true,
  image: true,
  slug: true,
  membership: { select: {
      id: true,
      expiresAt: true,
      type: { select: {
          id: true,
          name: true,
          level: true,
      }},
  }},
}}

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
        creator: PostCreatorSelect
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

export type PostStub = Post & {
  creator: CreatorStub & {
    membership: {
      id: string
      expiresAt: Date | null
      type: MembershipTypeStub
  }}
  likes: LikeStub[]
  shares: (Share & {
    creator: CreatorStub
  })[]
  _count: {
    likes: number
    shares: number
  }
  images: PostImage[]
  commentThread: CommentThreadStub
  share?: ShareStub
}

export const PostStubInclude = {
  include: {
    creator: PostCreatorSelect,
    likes: {
      include: {
        creator: PostCreatorSelect,
      },
      take: 10,
    },
    shares: {
      include: {
        creator: PostCreatorSelect,
      },
      take: 10,
    },
    share: {
      include: {
        creator: PostCreatorSelect,

        // INCLUDE SHARED BOOK
        book: {
          include: {
            likes: {
              include: {
                creator: PostCreatorSelect,
              },
              take: 10,
            },
            shares: {
              include: {
                creator: PostCreatorSelect,
              },
              take: 10,
            },
            authors: AuthorStubInclude,
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
            creator: PostCreatorSelect,
            likes: {
              include: {
                creator: PostCreatorSelect,
              },
              take: 10,
            },
            shares: {
              include: {
                creator: PostCreatorSelect,
              },
              take: 10,
            },
            image: {
              include: {
                creator: PostCreatorSelect,
                likes: {
                  include: {
                    creator: PostCreatorSelect,
                  },
                  take: 10,
                },
                shares: {
                  include: {
                    creator: PostCreatorSelect,
                  },
                  take: 10,
                },
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

        // INCLUDE SHARED POST
        post: SharedPostFeedInclude,

        // INCLUDE SHARED ARTICLE
        article: {
          select: {
            id: true,
            banner: true,
            createdAt: true,
            updatedAt: true,
            startDate: true,
            endDate: true,
            hook: true,
            priority: true,
            title: true,
            slug: true,
            type: true,
            views: true,
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
              skip: 0,
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
              skip: 0,
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
                  skip: 0,
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
                  skip: 0,
                },
              },
            },
            commentThread: {
              include: {
                comments: {
                  take: 10,
                  skip: 0,
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
          },
        },
      },
    },
    images: {include: {
      creator: { select: {
        id: true,
        name: true,
        image: true,
        slug: true,
        membership: { select: {
            id: true,
            expiresAt: true,
            type: {select: {
                id: true,
                name: true,
                level: true,
            }},
        }},
      }},
      _count: { select: {
        likes: true,
        shares: true
      }},
      likes: { include: {
        creator: { select: {
          id: true,
          name: true,
          image: true,
          slug: true,
          membership: { select: {
              id: true,
              expiresAt: true,
              type: {select: {
                  id: true,
                  name: true,
                  level: true,
              }},
          }},
        }}
      }},
      shares: { include: {
        creator: { select: {
          id: true,
          name: true,
          image: true,
          slug: true,
          membership: { select: {
              id: true,
              expiresAt: true,
              type: {select: {
                  id: true,
                  name: true,
                  level: true,
              }},
          }},
        }}
      }}
    }},
    commentThread: {
      include: {
        comments: {
          include: {
            creator: PostCreatorSelect,
          },
          take: 10,
        },
        commune: true,
        blocked: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        shares: true,
      },
    },
  },
}

// TODO
export type PostDetail = PostStub

// TODO
export const PostDetailInclude = PostStubInclude