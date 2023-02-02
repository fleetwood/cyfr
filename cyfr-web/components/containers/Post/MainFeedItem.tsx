import { timeDifference } from "../../../utils/helpers"
import Avatar from "../../ui/avatar"
import PostItemFooter from "./PostItemFooter"
import ReactHtmlParser from "react-html-parser"
import { MainFeed } from "../../../prisma/types"
import Link from "next/link"
import { ReactNode } from "react"

type MainFeedItemProps = {
  item: MainFeed
}

const MainFeedItem = ({item}:MainFeedItemProps) => {
  const {post} = item.share || item
  const comments = post?.post_comments || []
  const isShare = item.type === "ShareFeed"
  const contentClassName = isShare 
    ? "bg-gray-500 bg-opacity-50 p-4 rounded-lg text-base-content border-2 border-dashed border-base-content"
    : "bg-base-300 p-4 rounded-lg text-base-content"

  return post ? (
    <div className={`
      mt-4 p-4 
      rounded-2xl
      snap-always snap-start
      flex flex-col
      bg-neutral-content 
      ${isShare 
          ? `bg-opacity-60 accent-glow-sm` 
          : `even:bg-opacity-80 odd:bg-opacity-100`
      }`}>
        <div className="w-full relative">
        <Avatar
          shadow={true}
          user={post.author}
          sz="sm"
          className="float-right"
        />
        <div className="absolute bottom-0">
          <Link href={`/post/${post.id}`} className="text-primary underline">
            {isShare ? "Shared" : "Posted"} {timeDifference(post.createdAt)}
          </Link>
        </div>
      </div>
      <div>
        {post.content && 
          ReactHtmlParser(post.content)
        }
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
      </div>
      <div className="flex flex-row justify-around py-4">
        {post.content && <PostItemFooter post={post} />}
      </div>
    </div>
  ) : <></>
}

export default MainFeedItem
