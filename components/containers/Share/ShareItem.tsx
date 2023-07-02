import ReactHtmlParser from 'react-html-parser'
import Avatar from "../../ui/avatar"
import { PostStub } from 'prisma/types'

type ShareItemProps = {
    post: PostStub
}
const ShareItem = ({post}:ShareItemProps) => {
  return (
    <>
    {post && 
        <div className="relative">
            <div>{ReactHtmlParser(post.content!)}</div>
            <div className="absolute -mt-6 right-0">
                <Avatar shadow={true} user={post.creator} sz="sm" />
            </div>
        </div>
    }
    </>
  )
}
export default ShareItem