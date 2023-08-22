import {AgentStub,ArtistStub,AuthorStub,BookStub,EditorStub,Follow,FollowStub,GalleryStub,Membership,MembershipStub,Post,PostStub,ReaderStub,User} from "prisma/prismaContext"

export type FollowerTypes = 'Friends'|'Fans'|'Followers'|'Following'|'Stans'
export type UserTypes = 'Author' | 'Artist' | 'Editor' | 'Agent' | 'Reader' | 'Public'

export type UserSearchProps = {
  id:             string
  search?:        string
  followerTypes?: FollowerTypes[]
  userTypes?:     UserTypes[]
  agg?:           boolean
}

export type UserFeed = User & {
  _count:       { sessions: number }
  membership?:  Membership
  posts:        Post[]
  follows:      Follow[]
  followers:    Follow[]
}

export const UserFeedInclude = {
  membership: true,
  posts: true,
  likes: true,
  following: true,
  follower: true,
  _count: {
    select: {
      sessions: true
    }
  }
}
export type UserStub = {
  id:     string
  name:   string
  image:  string
  slug?:  string
  membership: MembershipStub
}

/**
 * NOTE! Use a `select` instead of `include`
 * @returns {
 *  id: String
 *  name: String
 *  image: String (url)
 *  slug: String
 * }
 */
export const UserStubSelect = {
  select: {
    id: true,
    name: true,
    image: true,
    slug: true,
    // MembershipStubSelect
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
}

export type UserDetail = User & {
  membership?:  MembershipStub
  posts:        PostStub[]
  books:        BookStub[]
  follower:     FollowStub[]
  following:    FollowStub[]
  galleries:    GalleryStub[]
  // books:        BookStub[]
  _count: {
    likes:        number,
    posts:        number,
    follower:     number,
    following:    number,
    books:        number,
    galleries:    number,
    submissions:  number
  }
}

export const UserDetailInclude = {
  include: {
    // MembershipStubSelect,
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
    galleries: {
      include: {
        galleries: {
          where: {
            visible: true,
          },
          // GalleryStubInclude
          include: {
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
                    shares: true,
                  },
                },
              },
            },
            commentThread: {
              include: {
                comments: {
                  include: {
                    creator: true,
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
      },
    },
    posts: {
      include: {
        // PostCreatorSelect,
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
        likes: {
          include: {
            // PostCreatorSelect,
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
            // PostCreatorSelect,
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
        share: {
          include: {
            // PostCreatorSelect,
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

            // INCLUDE SHARED BOOK
            book: {
              include: {
                likes: {
                  include: {
                    // PostCreatorSelect,
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
                    // PostCreatorSelect,
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
                // AuthorStubInclude,
                authors: {
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
                // PostCreatorSelect,
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
                likes: {
                  include: {
                    // PostCreatorSelect,
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
                    // PostCreatorSelect,
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
                image: {
                  include: {
                    // PostCreatorSelect,
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
                    likes: {
                      include: {
                        // PostCreatorSelect,
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
                        // PostCreatorSelect,
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
            // SharedPostFeedInclude,
            post: {
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
                        membership: true,
                      },
                    },
                  },
                  take: 10,
                },
                _count: {
                  select: {
                    likes: true,
                    shares: true,
                  },
                },
                commentThread: {
                  include: {
                    comments: {
                      include: {
                        // PostCreatorSelect
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
                    commune: true,
                    blocked: true,
                    _count: {
                      select: {
                        comments: true,
                      },
                    },
                  },
                },
              },
            },

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
        images: {
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
            _count: {
              select: {
                likes: true,
                shares: true,
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
            },
          },
        },
        commentThread: {
          include: {
            comments: {
              include: {
                // PostCreatorSelect,
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
      take: 10,
      orderBy: { updatedAt: 'desc' },
    },
    // books: {
    //   where: {
    //     visible: true
    //   },
    //   include: {
    //     cover: true,
    //     authors: true,
    //     _count: {
    //       select: {
    //         chapters: true,
    //         characters: true,
    //         likes: true,
    //         shares: true
    //       }
    //     }
    //   }
    // },
    follower: {
      include: {
        // UserStubSelect,
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            // MembershipStubSelect
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
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    following: {
      include: {
        // UserStubSelect,
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            // MembershipStubSelect
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
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    _count: {
      select: {
        likes: true,
        posts: true,
        follower: true,
        following: true,
        books: true,
        galleries: true,
        submissions: true,
      },
    },
  },
}

/**
 * NOTE! Use a `select` instead of `include`
 * @property id: String
 * @property name: String
 * @property image: String (url)
 * @property isFan: Boolean | null
 */
export type UserFollow = UserStub & {
  isFan?: boolean
}

export type UserEngageProps = {
  followerId:   String
  followingId:  String
  isFan?:       Boolean
  active?:      Boolean
}

export type CreatorStub = UserStub

export const CreatorStubSelect = { select: {
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


export type UserSearchStub = UserStub & {
  author?:    AuthorStub
  artist?:    ArtistStub
  editor?:    EditorStub
  agent?:     AgentStub
  reader?:    ReaderStub
  
  follower:  ({
    isFan: boolean,
    followingId: string,
    follower: UserStub
  })[]

  following:  ({
    isFan: boolean,
    followerId: string,
    following: UserStub
  })[]

}

export const UserSearchStubSelect = (id:string) => {
  return {
    // ...UserStubSelect.select,
    user: {
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
        // MembershipStubSelect
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

    author: {
      include: {
        // UserStubSelect,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            // MembershipStubSelect
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
          where: {
            visible: true,
          },
        },
        _count: {
          select: {
            shares: true,
            reviews: true,
          },
        },
      },
    },
    artist: true,
    editor: true,
    agent: true,
    reader: true,

    follower: {
      where: {
        followingId: id,
      },
      select: {
        isFan: true,
        followingId: true,
        // UserStubSelect,
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            // MembershipStubSelect
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
    },
    following: {
      where: {
        followerId: id,
      },
      select: {
        isFan: true,
        followerId: true,
        // UserStubSelect,
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            // MembershipStubSelect
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
    },
  }}

export const membershipToType = (membership:MembershipStub):UserTypes=> {
  try {
    return membership.type.name as UserTypes
  }
  catch (e) {
    return 'Reader'
  }
}
export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)