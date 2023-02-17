import { useEffect, useState } from "react"
import io from "socket.io-client"
import { User } from "../../../prisma/prismaContext"
import { getApi, SocketListeners } from "../../../utils/api"
import { now, timeDifference, uniqueKey } from "../../../utils/helpers"
import { log } from "../../../utils/log"
import TailwindInput from "../../forms/TailwindInput"
import Avatar from "../../ui/avatar"
import { ChatSendIcon } from "../../ui/icons"

export type ChatRoomProps = {
    firstPerson: User
    secondPerson: User
    lastUpdated?: Date
}

type ChatMessage = {
    userid:string
    message:string
    timestamp: string
}

// @ts-ignore
let socket

const ChatRoom = ({firstPerson, secondPerson, lastUpdated=now()}:ChatRoomProps) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [message, setMessage] = useState<string|null>(null)
    const users = [firstPerson.id, secondPerson.id]

    useEffect(() => {
      socketInitializer()
  
      return () => {
        // @ts-ignore
        if (socket) socket.disconnect()
      }
    }, [])
  
    async function socketInitializer() {
      await getApi("socket")
  
      socket = io()
  
      socket.on(SocketListeners.notification.listen, (data) => {
        // @ts-ignore
        log(`ChatRoom.tsx ${socket.id}: ${JSON.stringify(data)}`)
        setChatMessages((pre) => [...pre, data])
      })
    }
  
    function send() {
      console.log("sending message")
      // @ts-ignore
      socket.emit(SocketListeners.notification.send, {
        userid: firstPerson.id,
        message,
        timestamp: now()
      })
      setMessage(() => null)
    }

    const isFirstPerson = (user:string) => user === firstPerson.id

  return (
    <div className="min-w-[300px] border border-secondary bg-base-100 rounded-lg p-2 relative shadow-lg shadow-black">
        <div className="h-[0px]">
            <label className="z-10 absolute btn btn-xs btn-circle -right-1 -top-1" onClick={() => {}}>X</label>
        </div>
        <div className="flex bg-base-200 space-x-2 font-semibold">
            <Avatar user={secondPerson} link={false} sz="sm" />
            <span className="my-auto">{secondPerson.name}</span>
        </div>
        <div className="h-[240px] overflow-y-scroll scrollbar-thin space-y-2 my-2">
        {chatMessages.map((message:ChatMessage) => isFirstPerson(message.userid) 
            ?
            <div className="chat chat-start" key={`chatmessage-${uniqueKey(firstPerson, secondPerson)}-${message.timestamp}`}>
                <div className="chat-header">
                    <time className="text-xs opacity-50">{timeDifference(message.timestamp)}</time>
                </div>
                <div className="chat-bubble text-sm chat-bubble-primary">{message.message}</div>
            </div>
            : 
            <div className="chat chat-end">
                <div className="chat-header">
                    <time className="text-xs opacity-50">{timeDifference(message.timestamp)}</time>
                </div>
                <div className="chat-bubble text-sm chat-bubble-secondary">{message.message}</div>
            </div>
        )}
        </div>
        <div className="grid grid-flow-col justify-items-end">
            <TailwindInput 
                cardClassName="w-full"
                inputClassName="bg-base-200 text-base-content text-xs"
                type="text" placeholder="Message..." 
                value={message} setValue={setMessage} />
            <button className="my-1 btn btn-sm btn-primary" onClick={send}>{ChatSendIcon}</button>
        </div>
    </div>
  )
}
export default ChatRoom