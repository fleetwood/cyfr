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
  EventStub,
  Gallery,
  GalleryStub,
  Image,
  ImageStub,
  Post,
  PostStub,
  Share,
  UserStubSelect
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

export type ShareStub = Share & {
  creator: CreatorStub
  book?: BookStub
  character?: CharacterStub
  cover?: CoverStub
  event?: EventStub
  gallery?: GalleryStub
  image?: ImageStub
  post?: PostStub
}

export const ShareStubInclude = {
  include: {
    creator: CreatorStubSelect,
    // book: {
    //   include: {
    //     agent: {
    //       include: {
    //         user: {
    //           select: {
    //             name: true,
    //             id: true,
    //             slug: true,
    //             image: true,
    //           },
    //         },
    //         publisher: true,
    //         _count: {
    //           select: {
    //             authors: true,
    //             books: true,
    //             likes: true,
    //             reviews: true
    //           }
    //         }
    //       },
    //     },
    //     authors: {
    //       include: {
    //         user: {select: UserStubSelect},
    //         _count: { books: true}
    //       },
    //     },
    //     artists: {include: {
    //       user: {
    //         select: {
    //           name: true,
    //           id: true,
    //           slug: true,
    //           image: true,
    //         },
    //       },
    //       books: {
    //         take: 5
    //       },
    //       galleries: {
    //         take: 5
    //       },
    //       reviews: true,
    //       covers: {
    //         take: 5
    //       },
    //       _count: {
    //         books: true,
    //         galleries: true,
    //         reviews: true,
    //         covers: true
    //       }
    //   }},
    //     publisher: true,
    //     genre: true,
    //     gallery: {
    //       include: {
    //         creator: true,
    //         images: {
    //           include: {
    //             _count: {
    //               select: {
    //                 likes: true,
    //                 shares: true,
    //               },
    //             },
    //           },
    //         },
    //         commentThread: {
    //           include: {
    //             comments: {
    //               include: {
    //                 creator: true,
    //               },
    //               take: 10,
    //             },
    //             _count: {
    //               select: {
    //                 comments: true,
    //               },
    //             },
    //           },
    //         },
    //         permission: true,
    //         _count: {
    //           select: {
    //             likes: true,
    //             shares: true,
    //           },
    //         },
    //       },
    //     },
    //     cover: {
    //       include: {
    //         image: true,
    //         artists: true,
    //       },
    //     },
    //     _count: {
    //       select: {
    //         chapters: true,
    //         characters: true,
    //         likes: true,
    //         shares: true,
    //         follows: true,
    //         readers: true,
    //         reviews: true,
    //       },
    //     },
    //   },
    // },
    character: {
      include: {
        authors: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
          },
        },
        books: true,
        gallery: true,
      },
      _count: {
        select: {
          likes: true,
          shares: true,
        },
      },
    },
    cover: {
      include: {
        image: true,
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            slug: true,
            membership: true,
          },
        },
        artists: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
                slug: true,
                image: true,
              },
            },
          },
        },
        genre: true,
        _count: {
          select: {
            likes: true,
            shares: true,
          },
        },
      },
    },
    event: {
      include: {
        creator: CreatorStubSelect,
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
    image: {
      include: {
        creator: { select: UserStubSelect },
        gallery: true,
        _count: {
          select: {
            likes: true,
            shares: true
          },
        },
        commentThread: {
          include: {
            comments: {
              include: {
                creator: true,
              },
            },
          },
        },
      },
    },
    post: {
      include: {
        _count: {
          select: {
            likes: true,
            shares: true,
          },
        },
        creator: CreatorStubSelect,
        shares: {
          take: 10
        },
        share: true,
        images: true,
        commentThread: {
          include: {
            comments: {
              take: 10
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
  },
}