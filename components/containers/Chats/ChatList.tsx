import {useState} from "react"
import {GetUserType} from "utils/helpers/user"
import useDebug from "hooks/useDebug"
import {UserStub} from "prisma/prismaContext"
import {domRef,now} from "utils/helpers"
import {useCyfrUserContext} from "../../context/CyfrUserProvider"
import UserAvatar, {AvatarUser} from "../../ui/avatar/userAvatar"
import ChatRoom,{ChatRoomProps} from "./ChatRoom"

const {debug} = useDebug("components/containers/ChatList.tpx")

const ChatList = () => {
    const {cyfrUser} = useCyfrUserContext()
    const [show, setShow] = useState<boolean>(false)
    const [chatRooms, setChatRooms] = useState<ChatRoomProps[]>([])

    const addRoom = (secondPerson:UserStub) => {
        const room:ChatRoomProps = {
            firstPerson: cyfrUser,
            secondPerson,
            lastUpdated: now(),
            onCloseRoom: closeRoom
        }
        
        // filter out the current room, this will either add the room
        // or move it to end of array
        setChatRooms((rooms) => [...rooms.filter(r => !(
            r.firstPerson.id === room.firstPerson.id && 
            r.secondPerson.id === room.secondPerson.id
        )), room])
        setShow(() => true)
    }

    const closeRoom = (secondPersonId: string) => {
        debug(`closeRoom`, secondPersonId)
        setChatRooms((rooms) => [...rooms.filter(r => !(
            r.secondPerson.id === secondPersonId
        ))])
    }

    const onCloseAll = () => {
        setChatRooms(() => [])
        setShow(() => false)
    }

  return cyfrUser ? (
    <div className={`flex flex-col space-y-2`}>
        <h2 className="h-subtitle">Chat</h2>
        {cyfrUser.messagable && cyfrUser.messagable.map((u: AvatarUser) => 
            <div key={domRef('chatList',cyfrUser,u)}
                className="btn bg-opacity-10 hover:bg-opacity-25 bg-primary border-0 text-start"
                onClick={() => addRoom(u as UserStub)}
                >
                <UserAvatar user={u} userType={GetUserType(u as UserStub)} sz="sm" link={false} className="float-left" />
                <span className="ml-2">{u.name}</span>
            </div>
        )}
        <div className={`flex w-[50%] absolute bottom-28 right-56 justify-end space-x-4 pl-12 ${show ? `scale-x-100` : `scale-x-0`}`}>
            <div className="h-[20px]">
                <label className="z-10 absolute btn btn-sm right-0 -top-12" onClick={onCloseAll}>CLOSE ALL ►</label>
            </div>
            {chatRooms.slice(0,3).map(room => 
                <ChatRoom {...room} key={domRef('chatroom',room.firstPerson,room.secondPerson)} />
            )}
        </div>
    </div>
  ) : <></>
}
export default ChatList