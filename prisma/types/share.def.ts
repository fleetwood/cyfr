import {
  Book,
  BookStub,
  Character,
  CharacterStub,
  Cover,
  CoverStub,
  CreatorStub,
  CreatorStubSelect,
  CyfrUser,
  Gallery,
  GalleryStub,
  Image,
  ImageStub,
  LikeStub,
  Post,
  PostStub,
  Share,
  SharedPostStub
} from 'prisma/prismaContext'

export type ShareEngageProps = {
  creator: CyfrUser
  share: Share | ShareStub
}

export type SharePostProps = {
  creator: CyfrUser
  post: Post | PostStub
}

export type ShareImageProps = {
  creator: CyfrUser
  image: Image | ImageStub
}

export type ShareGalleryProps = {
  creator: CyfrUser
  gallery: Gallery | GalleryStub
}

export type ShareBookProps = {
  creator: CyfrUser
  book: Book | BookStub
}

export type ShareCharacterProps = {
  creator: CyfrUser
  character: Character | CharacterStub
}

export type ShareCoverProps = {
  creator: CyfrUser
  cover: Cover | CoverStub
}

export type ShareEventProps = {
  creator: CyfrUser
  event: Event
}

export type ShareAgentProps = {
  creator: CyfrUser
  event: Event
}

export type ShareUserProps = {
  creator: CyfrUser
  event: Event
}

export type SharesLikes = {
  likes:        LikeStub[]
  shares:       (Share & {
    creator:    CreatorStub
  })[]
}

export const SharesLikesInclude = {
  likes: {
    include: {
      creator: CreatorStubSelect
    },
    take: 10
  },
  shares: {
    include: {
      creator: CreatorStubSelect
    },
    take: 10
  }
}

export type CreatorSharesLikes = SharesLikes & {
  creator:  CreatorStub
}

export const CreatorSharesLikesInclude = {
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
}

export type ShareStub = Share & {
  creator:      CreatorStub
  // author?:      AuthorStub
  // agent?:       AgentStub
  // publisher?:   Publisher
  // submissions?: Submission
  // event?:       EventStub
  // review?:      Review
  book?:        BookStub
  cover?:       CoverStub
  character?:   CharacterStub
  gallery?:     GalleryStub
  image?:       ImageStub
  post?:        SharedPostStub
}

export const ShareStubInclude = { include: {
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
        _count: {
          select: {
            likes: true,
            shares: true,
          },
        },
      },
    },

    // INCLUDE SHARED POST
    post: {
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
        // images: PostImageInclude,
        commentThread: {
          include: {
            blocked: true,
            comments: {
              include: {
                creator: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
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
            likes: true,
            shares: true,
          },
        },
      },
    },
}}

export type ShareList = Share & {
  creator: CreatorStub
}

export const ShareListInclude = { include: {
  creator: CreatorStubSelect
}}