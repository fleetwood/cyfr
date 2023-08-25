import {CreatorStub,Notif,NotifType} from "prisma/prismaContext"

export type NotifSendProps = {
  userId: string
  notifType: NotifType
  message: string
}

export type NotifMarkProps = {
  id:       string
  seen?:    Date
  visible?: boolean
}

export type NotifProps = {
  creatorId:    string
  postId?:      string
  galleryId?:   string
  imageId?:     string
  commentId?:   string
  characterId?: string
  bookId?:      string
}

export type NotifStub = Notif & {
  creator: CreatorStub
}

export const NotifStubInclude = {
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
}
