import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { ChatDetail, SendMessageProps } from "../prisma/prismaContext"
import { sendApi } from "../utils/api"
import useDebug from "./useDebug"

const {debug, info} = useDebug({fileName: "useChatQuery"})

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
          info(`onSettled ${['chat', { party }]} ERROR`, { error, data })
        }
        if (data) {
          debug(`onSettled`, data)
            setRoom(data)
        }
      }
    }
  )

  const sendMessage = async (message:SendMessageProps) => {
    debug(`sendMessage`,message)
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
    debug(`invalidating`,q)
    qc.invalidateQueries(q)
  }
  
  return {
    room, 
    sendMessage,
    invalidateFeed
  }
}
