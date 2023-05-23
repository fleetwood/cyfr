import { useEffect, useState } from "react"
import CommentThreadDetail from "../../components/containers/Comment/CommentThreadDetail"
import InboxThreadList from "../../components/containers/Comment/InboxThreadList"
import SendMessageDetail from "../../components/containers/Comment/SendMessageDetail"
import { useCyfrUserContext } from "../../components/context/CyfrUserProvider"
import MainLayout from "../../components/layouts/MainLayout"
import { CyfrLogo } from "../../components/ui/icons"
import useDebug from "../../hooks/useDebug"
import useFeed from "../../hooks/useFeed"
import { useSession } from "../../lib/next-auth-react-query"
import { CommentThreadDetails } from "../../prisma/prismaContext"

const {debug, info, todo} = useDebug('pages/user/inbox')

const Inbox = ({}) => {
    useSession({required: true, redirectTo: '/login'})
    const [cyfrUser] = useCyfrUserContext()
    const {feed, sendMessage, invalidateFeed} = useFeed('inbox')
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
        invalidateFeed('inbox')
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
                {cyfrUser && (
                    <InboxThreadList cyfrUser={cyfrUser} threads={feed} setActive={showThreadView} />
                )}
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
