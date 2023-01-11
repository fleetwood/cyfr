import { Post } from "@prisma/client"
import { timeDifference } from "../../../utils/helpers"

const MainPagePostListItem = (post:Post) => {
  return (
    <div className="
      mt-4 p-4 
      bg-white bg-opacity-70 
      mix-blend-hard-light 
      rounded-2xl
      snap-always snap-start">
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