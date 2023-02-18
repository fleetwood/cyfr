import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { ChatDetail, ChatMessage, ChatRoom, SendMessageProps, User, UserDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"
import { log } from "../utils/log"

export async function getChatRoom(users:string[]):Promise<ChatDetail|null> {
  const res = await (await sendApi(`chat/connect`, {users})).data
  if (res) {
    return res.result as unknown as ChatDetail
  }
  return null
}

export const useChatRoomFeed = (users:string[]) => {
  const qc = useQueryClient()
  const party = users.sort().join('-')
  const [room, setRoom] = useState<ChatDetail>()

  const query = useQuery(
    ['chat', { party }],
    () => getChatRoom(users),
    {
      refetchInterval: 1000,
      onSettled(data,error) {
        if (error || data === null) {
          log(
            `\tuseChatRoomFeed.onSettled(${['chat', { party }]}) ERROR ${JSON.stringify({ error, data })}`
          )
        }
        if (data) {
          // log(`useChatRoomFeed.onSettled(${JSON.stringify(data, null, 2)})`)
            setRoom(data)
        }
      }
    }
  )

  const sendMessage = async (message:SendMessageProps) => {
    // log(`useChatQuery.sendMessage ${JSON.stringify(message, null, 2)}`)
    const res = await sendApi(`chat/message/send`, message)
    if (res) {
      return res
    }
    return null
  }

  const invalidateFeed = (users?:string[]) => {
    const q = users
      ? ['chat', { party: users.sort().join('-') }]
      : ['chat']
    log(`invalidating ${JSON.stringify(q)}`)
    qc.invalidateQueries(q)
  }
  
  return {
    room, 
    sendMessage,
    invalidateFeed
  }
}
