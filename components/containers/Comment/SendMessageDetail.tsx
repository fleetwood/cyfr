import { useState } from "react";
import { CommentThreadDetails, CyfrUser, UpsertInboxProps, User } from "../../../prisma/prismaContext";
import { uniqueKey, timeDifference } from "../../../utils/helpers";
import TailwindInput from "../../forms/TailwindInput";
import Avatar from "../../ui/avatar";
import { ChatSendIcon } from "../../ui/icons";
import RemirrorEditor from "../../forms/SocialTextarea";
import ReactHtmlParser from "react-html-parser"
import MentionsMenu from "../../ui/mentionsMenu";
import useDebug from "../../../hooks/useDebug";
import useFeed from "../../../hooks/useFeed";
import { useToast } from "../../context/ToastContextProvider";

const {debug} = useDebug('components/containers/SendMessageDetail')

type SendMessageDetailProps = {
    cyfrUser: CyfrUser
    activeThreads: CommentThreadDetails[]
    onCreate: (thread:CommentThreadDetails) => void
}

const SendMessageDetail = ({cyfrUser, activeThreads, onCreate}:SendMessageDetailProps) => {
    const {notify} = useToast()
    const [invalidate] = useFeed('inbox')
   const [party, setParty] = useState<User|null>(null)
   const [search, setSearch] = useState<string>('')
   const [message, setMessage] = useState<string|null>(null)
   const [thread, setThread] = useState<CommentThreadDetails|undefined>()
   const [valid, setValid] = useState<boolean>(false)
   const [showMentions, setShowMentions] = useState<boolean>(false)

   const onSend = async () => {
    debug('onSend', {valid, message, party: party?.name, cyfrUser: cyfrUser.name, thread })
    const inboxProps:UpsertInboxProps = {
        threadId: '',
        userId: cyfrUser.id,
        partyId: party!.id,
        messages: [{
            creatorId: cyfrUser.id,
            content: message!
        }]
    }
    notify('not implemented')
    return 
    // const inbox = await (await sendMessage(inboxProps))?.data.result
    // if (inbox) {
    //     notify('Message sent!')
    //     onCreate(inbox)
    // } else {
    //     notify(`Well that didn't work, sorry!`,'warning')
    // }
   }

   const onSelectParty = (user:User) => {
    setParty(() => user)
    setShowMentions(() => false)
   }

  return (
    <div className="min-w-fit m-0 overflow-y-scroll scrollbar-hide relative">
      <div className="grow flex justify-between place-items-end border-2 p-4">
        <span><Avatar user={cyfrUser} sz="md" link={false} />{cyfrUser.name}</span>
        {party 
          ? <span>{party.name}<Avatar user={party} sz="md" link={false} /></span> 
          : <MentionsMenu show={true} searchTerm={search} onSelect={onSelectParty} type='MESSAGABLE' />
        }
      </div>
      <div className="flex flex-col">
        {/* <div>{thread.id}</div> */}
        {thread && thread.comments.map((comment) => (
          <div
            className={`p-2 mt-2 w-full text-base-content`}
            key={uniqueKey(thread, comment)}
          >
            <div>
              <span>{comment.creator.name}</span>
              <span>{timeDifference(comment.updatedAt)}</span>
            </div>
            <div
              className={`p-2 border rounded-md 
                ${
                  comment.creatorId === cyfrUser.id ? "bg-base-200" : "bg-base-300"
                }`}
            >
              {ReactHtmlParser(comment.content!)}
            </div>
          </div>
        ))}
      </div>
      <div className="pb-12">
        <RemirrorEditor
          content={message}
          setContent={setMessage}
          setValid={setValid}
        />
        <button
          disabled={!valid}
          className={`float-right my-4 p-2 ${
            valid
              ? "text-info"
              : "text-base-content opacity-50 cursor-not-allowed"
          }`}
          onClick={onSend}
        >
          {ChatSendIcon}
        </button>
      </div>
    </div>
  );
};
export default SendMessageDetail;
