import { ChatMessage, ChatRoom } from "../prismaContext"

export type ChatDetail = ChatRoom & {
    messages: ChatMessage[]
}

export const ChatDetailInclude = {
    messages: true
}