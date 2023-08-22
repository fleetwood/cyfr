import {
  CommentThreadStub,
  Commune,
  CreatorSharesLikes,
  CreatorStub,
  CreatorStubSelect,
  Gallery,
  Image,
  Like,
  Permission,
} from 'prisma/prismaContext'
import { ImageStub, ImageUpsertProps } from './image.def'

export type GalleryUpsertProps = {
  galleryId?: string | null
  creatorId: string
  title?: string | null
  description?: string | null
  images?: ImageStub[] | Image[] | null
  files?: ImageUpsertProps[] | null
}

export type GalleryCreateProps = {
  galleryId?: string | null
  creatorId: string
  title?: string | null
  description?: string | null
  images?: ImageUpsertProps[] | Image[] | null
}

export type GalleryEngageProps = {
  creatorId: string
  galleryId: string
}

export const GalleryFeedInclude = {
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
        creator: {
          select: {
            name: true,
            email: true,
            slug: true,
            image: true,
          },
        },
        gallery: true,
      },
    },
  },
}

export type GalleryStub = Gallery &
  CreatorSharesLikes & {
    permission: Permission
    commentThread: CommentThreadStub
    images: ImageStub[]
    _count: {
      likes: number
      shares: number
    }
  }

export const GalleryStubInclude = {
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
}

export const GalleriesStubInclude = {
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
}

export type GalleryDetail = Gallery & {
  commune?: Commune
  creator: CreatorStub
  likes: (Like & {
    creator: CreatorStub
  })[]
  images: (Image & {
    likes: (Like & {
      creator: CreatorStub
    })[]
    _count: {
      shares: number
      likes: number
    }
  })[]
  permission: Permission
  _count: {
    shares: number
    likes: number
  }
}

export const GalleryDetailInclude = {
  include: {
    commune: true,
    // CreatorStubSelect,
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
        // CreatorStubSelect,
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
      // orderBy: {
      //   createdAt: 'desc'
      // }
    },
    images: {
      include: {
        likes: {
          include: {
            // CreatorStubSelect,
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
            shares: true,
            likes: true,
          },
        },
      },
    },
    permission: true,
    _count: {
      select: {
        shares: true,
        likes: true,
      },
    },
  },
}
