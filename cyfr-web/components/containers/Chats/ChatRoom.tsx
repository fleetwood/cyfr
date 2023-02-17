import { useEffect, useState } from "react"
import { User } from "../../../prisma/prismaContext"
import { now, timeDifference } from "../../../utils/helpers"
import TailwindInput from "../../forms/TailwindInput"
import Avatar from "../../ui/avatar"
import { ChatSendIcon } from "../../ui/icons"

export type ChatRoomProps = {
    firstPerson: User
    secondPerson: User
    lastUpdated?: Date
}

type ChatMessage = {
    user:User
    message:string
    timestamp: string
}

const ChatRoom = ({firstPerson, secondPerson, lastUpdated=now()}:ChatRoomProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [message, setMessage] = useState<string|null>(null)

    const fid = firstPerson.id
    const sid = secondPerson.id

    const isFirstPerson = ({id}:User) => id && id === fid
    const isSecondPerson = ({id}:User) => id && id === sid

    useEffect(() => {
        setMessages(() => [
            {user: secondPerson, message: `this is second person`, timestamp: now()+(60*2*1000).toString() },
            {user: secondPerson, message: `this is another test`, timestamp: now()+(60*2.5*1000).toString() },
            {user: firstPerson, message: "this is first person reply", timestamp: now()+(60*24*1000).toString() },
            {user: secondPerson, message: "this is second person reply", timestamp: now()+(60*35.15*1000).toString() },
        ])
    }, [])

  return (
    <div className="min-w-[300px] border border-secondary bg-base-100 rounded-lg p-2 relative">
        <div className="h-[0px]">
            <label className="z-10 absolute opacity-70 hover:opacity-100 btn btn-sm btn-circle btn-primary text-xs -right-3 -top-3" onClick={() => {}}>X</label>
        </div>
        <div className="flex justify-between">
            <Avatar user={firstPerson} link={false} sz="sm" />
            <Avatar user={secondPerson} link={false} sz="sm" />
        </div>
        <div className="h-[240px] overflow-y-scroll scrollbar-only space-y-2 my-2">
        {messages.map(message => isFirstPerson(message.user) 
            ?
            <div className="chat chat-start">
                <div className="chat-header">
                    <time className="text-xs opacity-50">{timeDifference(message.timestamp)}</time>
                </div>
                <div className="chat-bubble chat-bubble-primary">{message.message}</div>
            </div>
            : 
            <div className="chat chat-end">
                <div className="chat-header">
                    <time className="text-xs opacity-50">{timeDifference(message.timestamp)}</time>
                </div>
                <div className="chat-bubble chat-bubble-secondary">{message.message}</div>
            </div>
        )}
        </div>
        <div className="flex flex-row space-x-2">
            <TailwindInput 
                inputClassName="bg-base-200 text-base-content text-xs"
                type="text" placeholder="Message..." 
                value={message} setValue={setMessage} />
            <button className="btn p-2 bottom-0 btn-primary text-primary-content">{ChatSendIcon}</button>
        </div>
    </div>
  )
}
export default ChatRoom