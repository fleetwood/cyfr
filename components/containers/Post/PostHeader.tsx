import UserAvatar from "components/ui/avatar/userAvatar"
import Link from "next/link"
import { PostStub, UserTypes } from "prisma/prismaContext"
import { timeDifference } from "utils/helpers"

type PostHeaderProps = { 
  post: PostStub
}

const PostHeader = ({ post }: PostHeaderProps) => {
  const link = `/post/${post.id}`
  const userType:UserTypes = (post.creator.membership?.type?.name ?? undefined) as UserTypes
  return (
    <div className="p-2 bg-base-300">
      <div className="flex space-x-2 py-2">
        <UserAvatar user={post.creator} userType={userType} sz="md" />
        <Link href={link} className="text-primary underline">
          <span>{userType??'?'} Posted {timeDifference(post.updatedAt)}</span>
          <span className="text-xs ml-4">{post.id}</span>
        </Link>
      </div>
    </div>
  )
}
export default PostHeader
