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

const {debug, info, todo} = useDebug({fileName: "pages/user/inbox"})

export async function getServerSideProps(context: GetSessionParams | undefined) {
    const user = await PrismaUser.userInSession(context)
    const inboxes = user ? await PrismaComment.userInbox(user.id) : []
    debug('getServerSideProps', {user, inboxes})

    return { props: { user, inboxes: inboxes } }
}

type InboxProps = {
    cyfrUser: CyfrUser,
    inboxes: CommentThreadDetails[]
}

const Inbox = ({inboxes}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    useSession({required: true, redirectTo: '/login'})
    const [cyfrUser] = useCyfrUser()
    const [threads, setThreads] = useState<CommentThreadDetails[]>(inboxes)
    const [activeThread, setActiveThread] = useState<CommentThreadDetails>()

    const getInboxes = async () => {
        console.log('::getInboxes')
        debug('getInboxes(')
        todo('This should be in a query for invalidation purposes')
        const inboxes = await getApi('user/inbox')
        if (inboxes) {
            debug(`getInboxes result:`, {inboxes})
        } else {
            info('getInboxes fail')
        }
    }

    useEffect(() => {
        debug('useEffect', threads)
        getInboxes()
    }, [cyfrUser])

  return (
    <MainLayout pageTitle="Inbox" sectionTitle="Inbox">
        <div className="
                w-full min-h-screen max-h-screen 
                bg-base-100 rounded-lg p-2
                flex flex-col flex-grow flex-wrap space-x-4
                sm:flex-row sm:flex-nowrap">
            {cyfrUser &&
            <div className="w-fixed w-full flex-shrink flex-grow-0">
                <InboxThreadList cyfrUser={cyfrUser} threads={inboxes} setActive={setActiveThread} />
            </div>
            }
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
