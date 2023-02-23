import { useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { CommentThreadDetails, CyfrUser, User } from "../../../prisma/prismaContext"
import Avatar from "../../ui/avatar"
import ReactHtmlParser from "react-html-parser"
import RemirrorEditor from "../../ui/RemirrorEditor"
import { timeDifference } from "../../../utils/helpers"
const {debug} = useDebug({fileName: 'CommentThreadDetail', level: 'DEBUG'})

type CommentThreadDetailProps = {
    user: CyfrUser | User
    thread: CommentThreadDetails
}

const CommentThreadDetail = ({user, thread}:CommentThreadDetailProps) => {
    const [message, setMessage] = useState<string|null>(null)
    const party = thread.commune.users.filter(u => u.userId !== user.id)[0].user

  return (
    <div className="min-h-fit border-1">
        <div className="flex justify-between border-2 p-2">
            <span><Avatar user={user} sz="md" link={false} />{user.name}</span>
            <span>{party.name}<Avatar user={party} sz="md" link={false} /></span>
        </div>
        <div className="flex flex-col">
            {thread.comments.map(comment => (
                <div className={`p-2 mt-2 w-full text-base-content`}>
                    <div><span>{comment.author.name}</span><span>{timeDifference(comment.updatedAt)}</span></div>
                    <div className={`p-2 border rounded-md 
                    ${comment.authorId===user.id ? 'bg-base-200' : 'bg-base-300'}`}>{ReactHtmlParser(comment.content!)}</div>
                </div>
            ))}
        </div>
        <div>
            <RemirrorEditor content={message} setContent={setMessage} />
            <button className="btn btn-info p-2 my-2 rounded-md float-right">New Message</button>
        </div>
    </div>
  )
}
export default CommentThreadDetail