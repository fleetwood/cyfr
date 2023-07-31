import Avatar from "components/ui/avatar/avatar"
import Link from "next/link"
import { PostStub } from "prisma/prismaContext"
import { timeDifference } from "utils/helpers"

type PostHeaderProps = {
  post:       PostStub
  isShared?:  boolean
}

const PostHeader = ({ post, isShared }: PostHeaderProps) => {

  const link = `/post/${post.id}`

  return (
    <div className="pb-2">
      {isShared &&
        <div className="border-b border-dashed border-base-content flex space-x-2 pb-2 mb-2">
            <Avatar shadow={true} user={post.creator} sz="sm" />
            <div>Shared {timeDifference(post.createdAt)} ({post.id})</div>
        </div>
      }
      <div className="flex space-x-2 pb-2 mb-2">
        <Link href={link} className="text-primary underline">
          <span>Posted {timeDifference(post.updatedAt)}</span>
        </Link>
      </div>
    </div>
  )
}
export default PostHeader
