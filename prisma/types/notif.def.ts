import {CreatorStub,CreatorStubSelect,Notif, NotifType} from "prisma/prismaContext"

export type NotifSendProps = {
  userId: string
  notifType: NotifType
  message: string
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

export const NotifStubInclude = {include: {
  creator: CreatorStubSelect
}}
