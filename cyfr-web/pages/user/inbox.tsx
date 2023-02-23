import { GetSessionParams } from "next-auth/react"
import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import useCyfrUser from "../../hooks/useCyfrUser"
import useDebug from "../../hooks/useDebug"
import { useSession } from "../../lib/next-auth-react-query"
import { CommentThread, CommentThreadDetails, CyfrUser, PrismaComment, PrismaUser } from "../../prisma/prismaContext"
import { getApi } from "../../utils/api"
import { InferGetServerSidePropsType } from "next";
import Avatar from "../../components/ui/avatar"
import { uniqueKey } from "../../utils/helpers"
import CommentThreadDetail from "../../components/containers/Comment/CommentThreadDetail"
import InboxThreadList from "../../components/containers/Comment/InboxThreadList"
import { CyfrLogo } from "../../components/ui/icons"
import useFeed from "../../hooks/useFeed"

const {debug, info, todo} = useDebug({fileName: "pages/user/inbox"})

const Inbox = (props:any) => {
    useSession({required: true, redirectTo: '/login'})
    const [cyfrUser] = useCyfrUser()
    const {feed, sendMessage, invalidateFeed} = useFeed({type: 'inbox'})
    const [activeThread, setActiveThread] = useState<CommentThreadDetails>()

    useEffect(() => {
        debug('useEffect', feed)
        invalidateFeed({type: 'inbox'})
    }, [cyfrUser])

  return (
    <MainLayout pageTitle="Inbox" sectionTitle="Inbox">
        <div className="
                w-full min-h-screen max-h-screen 
                bg-base-100 rounded-lg p-2
                flex flex-col flex-grow flex-wrap space-x-4
                sm:flex-row sm:flex-nowrap">
            <div className="w-fixed w-full flex-shrink flex-grow-0">
                <label htmlFor={'inboxUserModal'} className="btn btn-info space-x-2">
                    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
                    <span className="text-info-content">Send a Message</span>
                </label>
                {cyfrUser &&
                    <InboxThreadList cyfrUser={cyfrUser} threads={feed} setActive={setActiveThread} />
                }
            </div>
            {cyfrUser &&
            <div className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative">
                {activeThread && 
                    <CommentThreadDetail thread={activeThread} user={cyfrUser} />
                }
            </div>
            }
        </div>
    </MainLayout>
  )
}
export default Inbox
