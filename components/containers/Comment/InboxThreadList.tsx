import { useState } from "react"
import { CommentThreadDetails, CyfrUser } from "../../../prisma/prismaContext"
import { domRef } from "../../../utils/helpers"
import Avatar from "../../ui/avatar"

type InboxThreadListProps = {
  cyfrUser: CyfrUser
  threads: CommentThreadDetails[]
  setActive?: Function
}

const InboxThreadList = ({
  cyfrUser,
  threads,
  setActive,
}: InboxThreadListProps) => {
  const [activeThread, setActiveThread] = useState<CommentThreadDetails>()

  const onThreadClick = (thread: CommentThreadDetails) => {
    setActiveThread(() => thread)
    if (setActive) {
      setActive(thread)
    }
  }
  return (
    <div className="w-full min-h-screen max-h-screen">
      {threads && threads.map((thread) => (
          <div className="w-full" key={domRef(cyfrUser, thread)}>
            {thread.commune.users
              .filter((u) => u.userId !== cyfrUser.id)
              .map((u) => (
                <div className={`
                  flex my-2 cursor-pointer p-2 rounded-md 
                  transition-all duration-200 ease-out w-full border
                  ${
                    activeThread && activeThread.id === thread.id
                      ? `bg-primary bg-opacity-30`
                      : ""
                  }
                  hover:bg-base-300`}
                  key={domRef(cyfrUser, thread, u)}
                  onClick={() => onThreadClick(thread)}
                >
                  <Avatar user={u.user} sz="sm" link={false} />
                  <span className="my-2 mx-2">{u.user.name}</span>
                  <span className="m-auto text-xs text-primary-content text-center float-right rounded-full h-4 w-4 bg-primary">{thread.comments.length}</span>
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}
export default InboxThreadList
