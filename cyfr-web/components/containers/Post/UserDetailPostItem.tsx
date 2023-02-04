import { timeDifference } from "../../../utils/helpers"
import PostItemFooter from "./PostItemFooter"
import ReactHtmlParser from "react-html-parser"
import { useEffect } from "react"
import { log } from "../../../utils/log"
import { PostDetail, PostFeed } from "../../../prisma/types/post.def"

type UserPostDetailProps = {
  post: PostFeed
}

const UserDetailPostItem = ({ post }: UserPostDetailProps) => {
  useEffect(() => {
    log(`USerDetailPost change ${post.id}`)
  },[post])
  return (
  <div className="even:bg-base-100 odd:bg-base-200 bg-opacity-50 rounded-lg mb-2 md:mb-4 p-2 md:p-4">
    {post.content && (
      <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
        {ReactHtmlParser(post.content)}
      </div>
    )}
    <div className="mb-2 md:mb-4">
      <div>{timeDifference(post.createdAt)}</div>
    </div>
    <div
      className="
        flex flex-row 
        justify-around 
        py-4"
      >
      {post.content && <PostItemFooter post={post} feed={"default"} />}
    </div>
  </div>
)}
export default UserDetailPostItem
