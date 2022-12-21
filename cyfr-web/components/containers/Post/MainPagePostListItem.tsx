import { Post } from "@prisma/client"
import { timeDifference } from "../../../utils/helpers"

const MainPagePostListItem = (post:Post) => {
  return (
    <div className="mt-4 p-4 bg-base-200 even:bg-base-300">
        <div className="border-b border-primary-content">
            <div>{post.authorid}</div>
            <div>Posted {timeDifference(post.createdAt)}</div>
        </div>
        <div>
        <h1 className="h-title">{post.title}</h1>
        <div className="text-base-content">{post.content}</div>
        </div>
    </div>
  )
}

export default MainPagePostListItem