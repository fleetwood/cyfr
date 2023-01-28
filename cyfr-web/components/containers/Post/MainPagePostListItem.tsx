import { timeDifference } from "../../../utils/helpers";
import Avatar from "./../../ui/avatar";
import PostItemFooter from "./PostItemFooter";
import ReactHtmlParser from "react-html-parser";
import ShareItemFooter from "./ShareItemFooter";
import { PostWithDetails } from "../../../prisma/types/post";
import JsonBlock from "../../ui/jsonBlock";
import Link from "next/link";

type MainPagePostProps = {
  post: PostWithDetails;
  key: string | number;
};

const MainPagePostListItem = ({ post }: MainPagePostProps) => (
  <div
    className="
      mt-4 p-4 
      bg-neutral-content
      even:bg-opacity-90 odd:bg-opacity-100
      rounded-2xl
      snap-always snap-start
      flex flex-col
      "
  >
    <div className="w-full relative">
      <Avatar
        shadow={true}
        user={post.author}
        sz="sm"
        className="float-right"
      />
      <span className="absolute bottom-0">
        <Link href={`/post/${post.id}`} className="text-primary underline">
          {post.content ? "Posted" : post.share ? "Shared" : ""}{" "}
          {timeDifference(post.createdAt)}
        </Link>
      </span>
    </div>
    <div>
      {post.content && (
        <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
          {ReactHtmlParser(post.content)}
        </div>
      )}
      {post.post_comments &&
        post.post_comments.slice(0, 5).map((comment) => (
          <div className="even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4">
            <Avatar user={comment.author} sz="xs" />
            <>{ReactHtmlParser(comment.content!)}</>
          </div>
        ))}
      {post.post_comments && post.post_comments.length >= 5 && (
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
      {post.share && (
        <div className="bg-base-300 border border-base-content p-4 mt-4 rounded-lg text-base-content flex space-x-4 relative">
          <div>{ReactHtmlParser(post.share.content!)}</div>
          <div className="absolute -mt-6 right-0">
            <Avatar shadow={true} user={post.share.author} sz="sm" />
          </div>
        </div>
      )}
    </div>
    <div
      className="
        flex flex-row 
        justify-around 
        py-4"
    >
      {post.content && <PostItemFooter post={post} />}
      {post.share && <ShareItemFooter sharedPost={post.share!} />}
    </div>
  </div>
);

export default MainPagePostListItem;
