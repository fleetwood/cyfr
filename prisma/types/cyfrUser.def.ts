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
  ReaderStub,
  ReaderStubInclude,
  UserStub,
} from 'prisma/prismaContext'

export type CyfrUser = UserStub & {
  agent?: AgentStub // user is an agent
  artist?: ArtistStub // user is an artist
  author?: AuthorStub
  editor?: EditorStub // user is an editor
  reader?: ReaderStub // user is a reader
  galleries: GalleryStub[]
  _count: {
    posts: number
    follower: number
    following: number
  }
}

/**
 * Nested includes are hard-coded here as follows
 * @prop AuthorStub {@link AuthorStubInclude}
 * @prop AgentStub {@link AgentStubInclude}
 */
export const CyfrUserInclude = { include: {

  _count: {
    select: {
      posts: true,
      follower: true,
      following: true,
    },
  },

  agent: {
    include: {
      user: {
        select: {
          name: true,
          id: true,
          slug: true,
          image: true,
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

  artist: { include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
      },
    },
    books: {
      take: 5,
    },
    galleries: {
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
        reviews: true
      }
    },
  }},

  author: {
    include: {
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

  galleries: {
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
      images: {
        include: {
          _count: {
            select: {
              likes: true,
              shares: true,
            },
          },
        },
      },
      commentThread: {
        include: {
          comments: {
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      permission: true,
      _count: {
        select: {
          likes: true,
          shares: true,
        },
      },
    },
  },
  membership: {
    include: {
      type: true,
    },
  },
}}