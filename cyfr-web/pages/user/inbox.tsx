import { useEffect, useState } from "react"
import MainLayout from "../../components/layouts/MainLayout"
import useCyfrUser from "../../hooks/useCyfrUser"
import { useSession } from "../../lib/next-auth-react-query"
import { CommentThread, CommentThreadDetails } from "../../prisma/prismaContext"
import { getApi, sendApi } from "../../utils/api"
import { log, todo } from "../../utils/log"

const Inbox = () => {
    const [cyfrUser] = useCyfrUser()
    const [session] = useSession({required: true, redirectTo: '/login'})
    const [threads, setThreads] = useState<CommentThreadDetails[]>([])

    const getInboxes = async () => {
        todo('This should be in a query for invalidation purposes')
        const inboxes = await getApi('user/inbox')
        if (inboxes) {
            log(`user/inbox getInboxes ${JSON.stringify({inboxes},null,1)}`)
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
