import { useEffect, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { CommentThreadDetails, CyfrUser, User } from "../../../prisma/prismaContext"
import Avatar from "../../ui/avatar"
import ReactHtmlParser from "react-html-parser"
import RemirrorEditor from "../../forms/SocialTextarea"
import { timeDifference, domRef } from "../../../utils/helpers"
import useFeed from "../../../hooks/useFeed"
import { ChatSendIcon } from "../../ui/icons"
import { useToast } from "../../context/ToastContextProvider"
const {debug} = useDebug('components/containers/CommentThreadDetail')

type CommentThreadDetailProps = {
    user: CyfrUser | User
    thread: CommentThreadDetails
}

const CommentThreadDetail = ({user, thread}:CommentThreadDetailProps) => {
    const {sendMessage, invalidateFeed} = useFeed({type: 'inbox'})
    const {notify} = useToast()
    const [message, setMessage] = useState<string|null>(null)
    const [valid, setValid] = useState<boolean>(true)
    const [canSend, setCanSend] = useState<boolean>(false)
    // because this is type inbox, we know there is only one other user in the commune
    const party = thread.commune.users.find(u => u.userId !== user.id)?.user

    const onSend = async () => {
        if (!canSend || !message) {
            notify("That didn't work....",'warning')
        }
        
        const data = {
            threadId: thread.id, 
            userId: user.id, 
            partyId: party!.id, 
            messages: [
                { authorId: user.id, content: message! }
            ]
        }
        debug('onSend', data)
        
        const send = await sendMessage(data)
        
        if (send) {
            notify("Message sent!")
            setMessage(() => null)
            invalidateFeed({type: 'inbox'})
        }
    }

    useEffect(() => {
        setCanSend(() => (valid && user !== undefined && party !== undefined))
    }, [message])

  return !party 
  ? (
    <div>
        Weird, doesn't appear to be anybody here....
    </div>
  ) 
  : (
    <div className="min-h-fit border-1">
        <div className="flex justify-between border-2 p-4">
            <span><Avatar user={user} sz="md" link={false} />{user.name}</span>
            <span>{party.name}<Avatar user={party} sz="md" link={false} /></span>
        </div>
        <div className="flex flex-col">
            <div>{thread.id}</div>
            {thread.comments.map(comment => (
                <div className={`p-2 mt-2 w-full text-base-content`} key={domRef(thread,comment)}>
                    <div><span>{comment.author.name}</span><span>{timeDifference(comment.updatedAt)}</span></div>
                    <div className={`p-2 border rounded-md 
                    ${comment.authorId===user.id ? 'bg-base-200' : 'bg-base-300'}`}>{ReactHtmlParser(comment.content!)}</div>
                </div>
            ))}
        </div>
        <div className="pb-12">
            <RemirrorEditor content={message} setContent={setMessage} setValid={setValid} />
            <button disabled={!valid} className={`float-right my-4 p-2 ${valid ? 'text-info' : 'text-base-content opacity-50 cursor-not-allowed'}`} onClick={onSend}>{ChatSendIcon}</button>
        </div>
    </div>
  )
}
export default CommentThreadDetail