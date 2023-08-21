import {
  AgentStub,
  AgentStubInclude,
  ArtistStub,
  ArtistStubInclude,
  AuthorStub,
  AuthorStubInclude,
  EditorStub,
  EditorStubInclude,
  GalleryStub,
  MembershipStubSelect,
  Notif,
  ReaderStub,
  ReaderStubInclude,
  UserStub,
} from 'prisma/prismaContext'
import {now} from 'utils/helpers'

export type CyfrUser = UserStub & {
  agent?: AgentStub // user is an agent
  artist?: ArtistStub // user is an artist
  author?: AuthorStub
  editor?: EditorStub // user is an editor
  reader?: ReaderStub // user is a reader
  notifs:  Notif[]
  _count: {
    posts: number
    follower: number
    following: number
    books: number
    galleries: number
  }
}

/**
 * Nested includes are hard-coded here as follows
 * @prop AuthorStub {@link AuthorStubInclude}
 * @prop AgentStub {@link AgentStubInclude}
 */
export const CyfrUserInclude = {
  include: {
    _count: {
      select: {
        posts: true,
        follower: true,
        following: true,
        books: true,
        galleries: true
      },
    },

    notifs: {
      where: {
        visible: true,
        seen: false,
        expiresAt: {
          gte: now().toISOString()
        }
      },
      take: 10
    },

    agent: {
      include: {
        user: {
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
        publisher: true,
        _count: {
          select: {
            authors: true,
            books: true,
            likes: true,
            reviews: true,
          },
        },
      },
    },

    artist: {
      include: {
        user: {
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
        books: {
          take: 5,
        },
        galleries: {include: {
            likes: {
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
            },
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
            images: {
              include: {
              _count: {
                select: {
                  likes: true,
                  shares: true
                }
              }}
            },
            commentThread: {
              include: {
                comments: {
                  include: {
                    creator: true
                  },
                  take: 10
                },
                _count: {
                  select: {
                    comments: true
                  }
                }
              }
            },
            permission: true,
            _count: {
              select: {
                likes: true,
                shares: true
              }
            },
          },
          take: 5,
        },
        reviews: true,
        covers: {
          take: 5,
        },
        _count: {
          select: {
            books: true,
            galleries: true,
            covers: true,
            reviews: true,
          },
        },
      },
    },

    author: {
      include: {
        user: {
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
        books: {
          include: {
            agent: true, // AgentStubInclude, // No stubs in stubs!
            authors: true, // AuthorStubInclude,
            artists: true, // ArtistStubInclude,
            publisher: true,
            genre: true,
            gallery: true, // GalleryStubInclude,
            cover: true, //
            _count: {
              select: {
                chapters: true,
                characters: true,
                likes: true,
                shares: true,
                follows: true,
                readers: true,
                reviews: true,
              },
            },
          },
          take: 5,
        },
        reviews: {
          take: 5,
        },
        _count: {
          select: {
            books: true,
            reviews: true,
          },
        },
      },
    },

    editor: {
      include: {
        user: {
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
        books: {
          include: {
            agent: true, // AgentStubInclude, // No stubs in stubs!
            // editors: true, // EditorStubInclude,
            artists: true, // ArtistStubInclude,
            publisher: true,
            genre: true,
            gallery: true, // GalleryStubInclude,
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
                reviews: true,
              },
            },
          },
          take: 5,
        },
        reviews: {
          take: 5,
        },
        _count: {
          select: {
            books: true,
            reviews: true,
          },
        },
      },
    },

    reader: {
      include: {
        user: {
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
        books: {
          include: {
            agent: true, // AgentStubInclude, // No stubs in stubs!
            readers: true, // ReaderStubInclude,
            artists: true, // ArtistStubInclude,
            publisher: true,
            genre: true,
            gallery: true, // GalleryStubInclude,
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
                reviews: true,
              },
            },
          },
          take: 5,
        },
        reviews: {
          take: 5,
        },
        _count: {
          select: {
            books: true,
            reviews: true,
          },
        },
      },
    },

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
}}