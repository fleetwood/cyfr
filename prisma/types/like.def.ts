import {CreatorStub,Like} from "prisma/prismaContext"

export type LikeProps = {
  creatorId:    string
  postId?:      string
  galleryId?:   string
  imageId?:     string
  commentId?:   string
  characterId?: string
  bookId?:      string
}

export type LikeStub = Like & {
  creator: CreatorStub
}

export const LikeStubInclude = {
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
}
