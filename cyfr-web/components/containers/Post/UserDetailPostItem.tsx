import Link from "next/link";
import { PostWithDetails } from "../../../prisma/posts";
import { timeDifference } from "../../../utils/helpers";
import PostItemFooter from "./PostItemFooter";
import ReactHtmlParser from "react-html-parser";

type UserPostDetailProps = {
  post: PostWithDetails
};

const UserDetailPostItem = ({ post }: UserPostDetailProps) => (
    <div className="even:bg-base-100 odd:bg-base-200 bg-opacity-50 rounded-lg mb-2 md:mb-4 p-2 md:p-4">
      <div className="mb-2 md:mb-4">
        <div>{timeDifference(post.createdAt)}</div>
        <div className="">
          <Link href={`/post/${post.id}`}>
            <h2 className="post-title">{post.title}</h2>
            {post.subtitle &&
              <h3 className="post-title">{post.subtitle}</h3>
            }
          </Link>
        </div>
      </div>

      <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
        {ReactHtmlParser(post.content)}
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
)
export default UserDetailPostItem;
