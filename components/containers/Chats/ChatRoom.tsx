import { useState } from "react"
import { useChatRoomFeed } from "../../../hooks/useChatQuery"
import useDebug from "../../../hooks/useDebug"
import { ChatMessage, User, UserSimple } from "../../../prisma/prismaContext"
import { now, timeDifference, uniqueKey } from "../../../utils/helpers"
import TailwindInput from "../../forms/TailwindInput"
import Avatar from "../../ui/avatar"
import { ChatSendIcon } from "../../ui/icons"


const {debug} = useDebug('components/containers/ChatRoom')

export type ChatRoomProps = {
    firstPerson: User
    secondPerson: UserSimple
    lastUpdated?: Date
    onCloseRoom: Function
}

// @ts-ignore
let socket

const ChatRoom = ({firstPerson, secondPerson, onCloseRoom, lastUpdated=now()}:ChatRoomProps) => {
    const users = [firstPerson.id, secondPerson.id]
    const {room, sendMessage, invalidateFeed} =  useChatRoomFeed(users)
    const [message, setMessage] = useState<string|null>(null)
    
    const onSendClick = async () => {
        const data = {
            authorId: firstPerson.id,
            content: message!,
            chatRoomId: room!.id
        }
        debug('onSendClick', data)
        const send = await sendMessage(data)
        if (send) {
            setMessage(null)
            invalidateFeed(users)
        }
    }

    const closeChatRoom = () => {
        debug(`closeChatRoom`,secondPerson.id)
        onCloseRoom(secondPerson.id)
    }

    // const room = SocketListeners.chat.room(users),
    //       announce = SocketListeners.chat.announce(users),
    //       subscribe = SocketListeners.chat.subscribe(users)

    // useEffect(() => {
    //   socketInitializer()
  
    //   return () => {
    //     // @ts-ignore
    //     if (socket) socket.disconnect()
    //   }
    // }, [])
  
    // async function socketInitializer() {
    //   await sendApi("socket/chat", {users})
  
    //   socket = io()
  
    //   socket.on(subscribe, (data) => {
    //     // @ts-ignore
    //     debug(`ChatRoom`, {socketid: socket.id, data})
    //     setChatMessages((pre) => [...pre, data])
    //   })
    // }
  
    // function sendMessage() {
    //   debug("sending message")
    //   // @ts-ignore
    //   socket.emit(announce, {
    //     userid: firstPerson.id,
    //     message,
    //     timestamp: now()
    //   })
    //   setMessage(() => null)
    // }

    const isFirstPerson = (user:string) => user === firstPerson.id
    const isValid = () => room && room?.id && message && message.length > 0

  return (
    <div className="min-w-[300px] border border-secondary bg-base-100 rounded-lg p-2 relative shadow-lg shadow-black">
        <div className="h-[0px]">
            <label className="z-10 absolute btn btn-xs btn-circle -right-1 -top-1" onClick={closeChatRoom}>X</label>
        </div>
        <div className="flex bg-base-200 space-x-2 font-semibold">
            <Avatar user={secondPerson} link={false} sz="sm" />
            <span className="my-auto">{secondPerson.name}</span>
        </div>
        {room && (
            <div className="h-[240px] overflow-y-scroll scrollbar-thin space-y-2 my-2">
            <div className="text-xs opacity-50">{room.id}</div>
            {room.messages?.map((message:ChatMessage) => isFirstPerson(message.authorId) 
                ?
                <div className="chat chat-end" key={`chatmessage-${uniqueKey(firstPerson, secondPerson)}-${message.updatedAt}`}>
                    <div className="chat-header">
                        <time className="text-xs opacity-50">{timeDifference(message.updatedAt)}</time>
                    </div>
                    <div className="chat-bubble text-sm chat-bubble-secondary">{message.content}</div>
                </div>
                :
                <div className="chat chat-start" key={`chatmessage-${uniqueKey(firstPerson, secondPerson)}-${message.updatedAt}`}>
                    <div className="chat-header">
                        <time className="text-xs opacity-50">{timeDifference(message.updatedAt)}</time>
                    </div>
                    <div className="chat-bubble text-sm chat-bubble-primary">{message.content}</div>
                </div>
            )}
        </div>
        )}
        {room && 
            <div className="grid grid-flow-col justify-items-end">
                <TailwindInput 
                    cardClassName="w-full"
                    inputClassName="bg-base-200 text-base-content text-xs"
                    type="text" placeholder="Message..." 
                    value={message} setValue={setMessage} />
                <button className={`my-1 btn btn-sm btn-primary ${isValid() ? '' : '`opacity-50`'}`} onClick={onSendClick} >{ChatSendIcon}</button>
            </div>
        }
    </div>
  )
}
export default ChatRoom