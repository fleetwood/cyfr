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
        <div className="bg-base-100 w-full p-2 rounded-lg text-base-content columns-8">
            {cyfrUser &&
            <>
            <div className="col-2">
                {threads && threads.map(thread => (
                    <div key={uniqueKey(cyfrUser, thread)}>
                    {thread.commune.users.filter(u => u.userId !== cyfrUser.id).map(u => (
                        <div className={`
                            flex m-auto space-y-2 cursor-pointer p-2 rounded-md 
                            transition-all duration-200 ease-out
                            ${activeThread && activeThread.id === thread.id ? `bg-primary bg-opacity-30` : ''}
                            hover:bg-base-300
                            `}
                            key={uniqueKey(cyfrUser, thread, u)}
                            onClick={() => setActiveThread(() => thread)}
                            >
                            <Avatar user={u.user} sz="sm" />{u.user.name}
                        </div>
                    ))}
                    </div>
                ))}
            </div>
            <div className="col-6">
                {activeThread && (
                    <div>
                        <h2>Thread</h2>
                        {activeThread.comments.map(comment => (
                            <div>{comment.content}</div>
                        ))}
                    </div>
                )}
            </div>
            </>
            }
        </div>
    </MainLayout>
  )
}
export default Inbox
