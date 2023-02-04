import Link from "next/link";
import { useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { timeDifference } from "../../../utils/helpers";
import { log } from "../../../utils/log";
import Avatar from "../../ui/avatar";
import { PostFeed } from "../../../prisma/prismaContext";
import PostItemFooter from "./PostItemFooter";

type UserPostDetailProps = {
  post: PostFeed
};

const UserDetailPostItem = ({ post }: UserPostDetailProps) => {
  useEffect(() => {
    log(`USerDetailPost change ${post.id}`);
  }, [post]);
  return (
    <div className="mt-4 p-4 rounded-2xl snap-always snap-start flex flex-col bg-neutral-content">
      <div className="">
        <Link href={`/post/${post.id}`} className="text-primary underline">
          {timeDifference(post.createdAt)}
        </Link>
      </div>
      <div className="p-4 mt-4">
        {post.content && ReactHtmlParser(post.content)}
        {post.post_comments && post.post_comments.length > 0 && (
          <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
        )}
        {post.post_comments.slice(0, 5).map((comment) => (
          <div className="even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4">
            <Avatar user={comment.author} sz="xs" />
            <>{ReactHtmlParser(comment.content!)}</>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-around py-4">
        {post.content && <PostItemFooter post={post} feed="user" />}
      </div>
    </div>
  );
};
export default UserDetailPostItem;
