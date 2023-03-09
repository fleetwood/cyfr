import { ChatMessage, ChatRoom } from "../prismaContext"

export type ChatCreateProps = {
  users: string[]
}

export type SendMessageProps = {
  content: string
  authorId: string
  chatRoomId: string
}

export type ChatDetail = ChatRoom & {
  messages: ChatMessage[]
}

export const ChatDetailInclude = {
  messages: true,
}
