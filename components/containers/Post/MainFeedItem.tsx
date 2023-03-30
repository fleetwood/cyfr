import Link from "next/link"
import ReactHtmlParser from "react-html-parser"
import { MainFeed } from "../../../prisma/prismaContext"
import { timeDifference, uuid } from "../../../utils/helpers"
import Avatar from "../../ui/avatar"
import HtmlContent from "../../ui/htmlContent"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import PostItemFooter from "./PostItemFooter"

import useDebug from "../../../hooks/useDebug"
const {debug} = useDebug("MainFeedItem")

type MainFeedItemProps = {
  item: MainFeed
}

const MainFeedItem = ({item}:MainFeedItemProps) => {
  const {post} = item.share || item
  const comments = post?.post_comments || []
  const isShare = item.type === "ShareFeed"

  return post ? (
    <div className={`
      mt-4 p-4 
      rounded-2xl
      snap-always snap-start
      flex flex-col
      bg-neutral-content 
      ${isShare 
          ? `bg-opacity-80 accent-glow-sm` 
          : ``
      }`}>
      {isShare && (
        <div className="w-full mb-2 pb-2 border-b border-dashed border-base-content relative flex">
        <Avatar
          shadow={true}
          user={item.share!.author}
          sz="sm"
        />
        <div>
            Shared {timeDifference((item.share?.createdat || '').toString())}
        </div>
      </div>
      )}
        <div className="w-full relative flex">
        <Avatar
          shadow={true}
          user={post.author}
          sz="sm"
        />
        <div className="">
          <Link href={`/post/${post.id}`} className="text-primary underline">
            Posted {timeDifference((post.createdat || '').toString())}
          </Link>
        </div>
      </div>
      <div className="p-4 mt-4 font-feed">
        
        {post.content && <HtmlContent content={post.content}/>}

        {post.images?.length > 0 && post.images[0] !== null &&
          <GalleryPhotoswipe images={post.images} />
        }

        {comments && comments.length > 0 && <div className="mt-4 text-sm font-semibold">⤵ Replies</div>}
        {comments && comments.slice(0, 5).map((comment) => (
          <div className="font-feed even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4" key={`item:${item.post?.id||item.share?.id||uuid()}-comment:${comment.id}`}>
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
                <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content flex space-x-4" key={`item:${item.post?.id||item.share?.id||uuid()}-comment:${comment.id}`}>
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
        <PostItemFooter post={post} feed="main" />
      </div>
    </div>
  ) : <></>
}

export default MainFeedItem
