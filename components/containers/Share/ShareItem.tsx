import HtmlContent from 'components/ui/htmlContent'
import { PostStub } from 'prisma/types'
import Avatar from "../../ui/avatar/avatar"

type ShareItemProps = {
    post: PostStub
}
const ShareItem = ({post}:ShareItemProps) => {
  return (
    <>
    {post && 
        <div className="relative">
            {post.content && <HtmlContent content={post.content} className="font-feed" />}
            <div className="absolute -mt-6 right-0">
                <Avatar shadow={true} user={post.creator} sz="sm" />
            </div>
        </div>
    }
    </>
  )
}
export default ShareItem