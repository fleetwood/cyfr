import { timeDifference, uniqueKey, uuid } from "../../../utils/helpers"
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
  const images = post?.images || []
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
            {timeDifference(item.share!.createdAt)}
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
            {timeDifference(post.createdAt)}
          </Link>
        </div>
      </div>
      <div className="p-4 mt-4">
        {post.content && 
          ReactHtmlParser(post.content)
        }
        {images.length > 0 && 
          <div className="columns-2 md:columns-4 lg:columns-6">
            {images.map((image) => (
              <img className="mb-4" src={image.url} key={uniqueKey('post-images',post,image)} />
            ))}
          </div>
        }
        {comments && comments.length > 0 && <div className="mt-4 text-sm font-semibold">⤵ Replies</div>}
        {comments && comments.slice(0, 5).map((comment) => (
          <div className="even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4" key={`item:${item.post?.id||item.share?.id||uuid()}-comment:${comment.id}`}>
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
        {post.content && <PostItemFooter post={post} feed="main" />}
      </div>
    </div>
  ) : <></>
}

export default MainFeedItem
