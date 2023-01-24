import { timeDifference } from "../../../utils/helpers"
import PostItemFooter from "./PostItemFooter"
import ReactHtmlParser from "react-html-parser"
import ShareItemFooter from "./ShareItemFooter"
import Avatar from "../../ui/avatar"
import { PostWithDetails } from "../../../prisma/types/post"
import { useEffect } from "react"
import { log } from "../../../utils/log"

type UserPostDetailProps = {
  post: PostWithDetails
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
    {post.share && (
      <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
        <div className="w-full flex relative">
          <Avatar user={post.share.author} sz="sm" shadow={true} className="absolute right-0 -mt-8" />
        </div>
        {ReactHtmlParser(post.share.content!)}
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
      {post.content && <PostItemFooter post={post} />}
      {post.share && <ShareItemFooter sharedPost={post.share} />}
    </div>
  </div>
)}
export default UserDetailPostItem
