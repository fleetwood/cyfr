import Avatar from "components/ui/avatar/avatar"
import Link from "next/link"
import { PostStub } from "prisma/prismaContext"
import { timeDifference } from "utils/helpers"

type PostHeaderProps = { 
  post: PostStub
}

const PostHeader = ({ post }: PostHeaderProps) => {
  const link = `/post/${post.id}`

  return (
    <div className="pb-2">
      <div className="flex space-x-2 pb-2 mb-2">
        <Avatar shadow={true} user={post.creator} sz="sm" />
        <Link href={link} className="text-primary underline">
          <span>Posted {timeDifference(post.updatedAt)}</span>
        </Link>
      </div>
    </div>
  )
}
export default PostHeader
