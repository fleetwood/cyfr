import { GetSessionParams } from "next-auth/react"
import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import useCyfrUser from "../../hooks/useCyfrUser"
import useDebug from "../../hooks/useDebug"
import { useSession } from "../../lib/next-auth-react-query"
import { CommentThread, CommentThreadDetails, CyfrUser, PrismaComment, PrismaUser, User } from "../../prisma/prismaContext"
import { getApi } from "../../utils/api"
import { InferGetServerSidePropsType } from "next";
import Avatar from "../../components/ui/avatar"
import { uniqueKey } from "../../utils/helpers"
import CommentThreadDetail from "../../components/containers/Comment/CommentThreadDetail"
import InboxThreadList from "../../components/containers/Comment/InboxThreadList"
import { ChatSendIcon, CyfrLogo } from "../../components/ui/icons"
import useFeed from "../../hooks/useFeed"
import SendMessageModal from "../../components/containers/Comment/SendMessageModal"
import TailwindInput from "../../components/forms/TailwindInput"
import SendMessageDetail from "../../components/containers/Comment/SendMessageDetail"

const {debug, info, todo} = useDebug({fileName: "pages/user/inbox"})

const Inbox = (props:any) => {
    useSession({required: true, redirectTo: '/login'})
    const [cyfrUser] = useCyfrUser()
    const {feed, sendMessage, invalidateFeed} = useFeed({type: 'inbox'})
    const [party, setParty] = useState<string|null>(null)
    const [activeThread, setActiveThread] = useState<CommentThreadDetails|null>(null)
    const [showModal, setShowModal] = useState(false)

    
    const showModalView = () => {
        setShowModal(() => true)
        setActiveThread(() => null)
    }

    const showThreadView = (thread:CommentThreadDetails) => {
        setShowModal(() => false)
        setActiveThread(() => thread)
    }

    useEffect(() => {
        debug('useEffect', feed)
        invalidateFeed({type: 'inbox'})
    }, [cyfrUser])

  return (
    <MainLayout pageTitle="Inbox" sectionTitle="Inbox">
        <div className="
                w-full bg-base-100 rounded-lg p-2
                flex flex-col flex-grow space-x-4
                sm:flex-row sm:flex-nowrap">
            <div className="w-fixed w-full flex-shrink grow-0 space-y-2">
                <label htmlFor={'inboxUserModal'} className="btn btn-info space-x-2 w-full" onClick={showModalView}>
                    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
                    <span className="text-info-content">Send a Message</span>
                </label>
                {cyfrUser &&
                    <InboxThreadList cyfrUser={cyfrUser} threads={feed} setActive={showThreadView} />
                }
            </div>
            {cyfrUser &&
            <div className="w-full grow m-0 overflow-y-scroll scrollbar-hide relative">
                {activeThread && 
                    <CommentThreadDetail thread={activeThread} user={cyfrUser} />
                }
            </div>
            }
            {showModal && 
                <SendMessageDetail cyfrUser={cyfrUser} activeThreads={feed} onCreate={showThreadView} />
            }
        </div>

        {/* <SendMessageModal checked={showModal} setChecked={setShowModal} /> */}
        
    </MainLayout>
  )
}
export default Inbox
