import Link from "next/link";
import { timeDifference } from "../../../utils/helpers";
import { PostWithDetails } from "./../../../prisma/posts";
import Avatar from "./../../ui/avatar";
import PostItemFooter from "./PostItemFooter";
import ReactHtmlParser from "react-html-parser";

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
      "
  >
    <div className="flex flex-row justify-between relative">
      <div className="absolute bottom-0">
        Posted {timeDifference(post.createdAt)}
      </div>
      <div className="flex justify-end w-full">
        <Avatar user={post.author} sz="sm" />
      </div>
    </div>
    <div>
      <div className="">
        <Link href={`/post/${post.id}`}>
          <h2 className="post-title">{post.title}</h2>
          {post.subtitle && <h3 className="post-title">{post.subtitle}</h3>}
        </Link>
      </div>
      <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
        {ReactHtmlParser(post.content)}
      </div>
    </div>
    <div
      className="
        flex flex-row 
        justify-around 
        py-4"
    >
      <PostItemFooter post={post} />
    </div>
  </div>
);

export default MainPagePostListItem;
