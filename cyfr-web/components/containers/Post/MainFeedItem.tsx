import { timeDifference } from "../../../utils/helpers"
import Avatar from "../../ui/avatar"
import PostItemFooter from "./PostItemFooter"
import ReactHtmlParser from "react-html-parser"
import { MainFeed } from "../../../prisma/types"
import Link from "next/link"

type MainFeedItemProps = {
  item: MainFeed
}
const MainFeedItem = ({item}:MainFeedItemProps) => {
  const {post} = item.share || item
  const comments = post?.post_comments || []
  const isShare = item.type==="ShareFeed"
  const contentClassName = isShare 
    ? "bg-base-300 p-4 rounded-lg text-base-content border-dashed"
    : "bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content"

  return post ? (
    <div className="
      mt-4 p-4 
      bg-neutral-content
      even:bg-opacity-90 odd:bg-opacity-100
      rounded-2xl
      snap-always snap-start
      flex flex-col"
      >
        <div className="w-full relative">
      <Avatar
        shadow={true}
        user={post.author}
        sz="sm"
        className="float-right"
      />
      <div className="absolute bottom-0">
        <Link href={`/post/${post.id}`} className="text-primary underline">
          {isShare ? "Posted" : "Shared"}{" "}
          {timeDifference(post.createdAt)}
        </Link>
      </div>
    </div>
    <div>
      {post.content && (
        <div className={contentClassName}>
          {ReactHtmlParser(post.content)}
        </div>
      )}
      {comments && comments.slice(0, 5).map((comment) => (
        <div className="even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4">
          <Avatar user={comment.author} sz="xs" />
          <>{ReactHtmlParser(comment.content!)}</>
        </div>
      ))}
      {comments && comments.length >= 5 && (
        <div
          tabIndex={0}
          className="collapse border border-base-300 bg-base-100 rounded-box"
        >
          <div className="collapse-content">
            {post.post_comments.slice(5).map((comment) => (
              <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content flex space-x-4">
                <Avatar user={comment.author} sz="xs" />
                <>{ReactHtmlParser(comment.content!)}</>
              </div>
            ))}
          </div>
          <div className="collapse-title collapse-arrow">{""}</div>
        </div>
      )}
      {/* {post.shares && (
        <div className="bg-base-300 border border-base-content p-4 mt-4 rounded-lg text-base-content flex space-x-4 relative">
          {post.shares.map(share => <ShareItem share={share} key={post.id+share.shareId} />)}  
        </div>
      )} */}
    </div>
    <div className="flex flex-row justify-around py-4">
      {post.content && <PostItemFooter post={post} />}
    </div>
    </div>
  ) : <></>
}

export default MainFeedItem
