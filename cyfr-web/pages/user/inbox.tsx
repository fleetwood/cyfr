import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import useCyfrUser from "../../hooks/useCyfrUser"
import useDebug from "../../hooks/useDebug"
import { useSession } from "../../lib/next-auth-react-query"
import { CommentThreadDetails } from "../../prisma/prismaContext"
import { getApi } from "../../utils/api"
const [debug, todo] = useDebug("pages/user/inbox")

const Inbox = (_props: any) => {
    const [cyfrUser] = useCyfrUser()
    const [session] = useSession({required: true, redirectTo: '/login'})
    const [threads, setThreads] = useState<CommentThreadDetails[]>([])

    const getInboxes = async () => {
        todo('This should be in a query for invalidation purposes')
        const inboxes = await getApi('user/inbox')
        if (inboxes) {
            debug(`getInboxes`, inboxes)
        }
    }

    useEffect(() => {
        getInboxes()
    }, [])

  return (
    <MainLayout pageTitle="Inbox" sectionTitle="Inbox">
        {threads && threads.map(thread => (
            <div className="bg-base-100 w-full p-2 rounded-lg text-base-content">
                {thread.comments.map(comment => (
                    <div className="my-2">{comment.content}</div>
                ))}
            </div>
        ))}
    </MainLayout>
  )
}
export default Inbox
