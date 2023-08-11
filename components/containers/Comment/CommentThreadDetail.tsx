import { useEffect, useState } from "react"
import { CommentThreadDetails, CyfrUser, UserStub } from "prisma/prismaContext"
import UserAvatar from "../../ui/avatar/userAvatar"
import ReactHtmlParser from "react-html-parser"
import RemirrorEditor from "../../forms/SocialTextarea"
import { timeDifference, uniqueKey } from "utils/helpers"
import useFeed from "hooks/useFeed"
import { ChatSendIcon } from "../../ui/icons"
import useDebug from "hooks/useDebug"
import {useToast} from "components/context/ToastContextProvider"
const {debug} = useDebug('components/containers/CommentThreadDetail')

type CommentThreadDetailProps = {
    user: CyfrUser | UserStub
    thread: CommentThreadDetails
}

const CommentThreadDetail = ({user, thread}:CommentThreadDetailProps) => {
    const {invalidate} = useFeed('inbox')
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
                { creatorId: user.id, content: message! }
            ]
        }
        debug('onSend', data)
        notify('not implemented')
        return
        // const send = await sendMessage(data)
        
        // if (send) {
        //     notify("Message sent!")
        //     setMessage(() => null)
        //     invalidate()
        // }
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
            <span><UserAvatar user={user} sz="md" link={false} />{user.name}</span>
            <span>{party.name}<UserAvatar user={party} sz="md" link={false} /></span>
        </div>
        <div className="flex flex-col">
            <div>{thread.id}</div>
            {thread.comments.map(comment => (
                <div className={`p-2 mt-2 w-full text-base-content`} key={uniqueKey(thread,comment)}>
                    <div><span>{comment.creator.name}</span><span>{timeDifference(comment.updatedAt)}</span></div>
                    <div className={`p-2 border rounded-md 
                    ${comment.creatorId===user.id ? 'bg-base-200' : 'bg-base-300'}`}>{ReactHtmlParser(comment.content!)}</div>
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