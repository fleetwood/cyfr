import { timeDifference } from "../../../utils/helpers";
import { PostWithDetails } from "./../../../prisma/posts";
import Avatar from "./../../ui/avatar";
import PostItemFooter from "./PostItemFooter";
import ReactHtmlParser from "react-html-parser";
import ShareItemFooter from "./ShareItemFooter";
import AvatarList from "../../ui/avatarList";

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
        <Avatar user={post.author} sz="sm" className="float-right" />
        <span className="absolute bottom-0">
          {post.content ? 'Posted' : post.share ? 'Shared' : ''} {timeDifference(post.createdAt)}
        </span>
    </div>
    <div>
      {post.content && 
      <div className="bg-base-300 bg-opacity-50 p-4 rounded-lg text-base-content">
        {ReactHtmlParser(post.content)}
      </div>
      }
      {post.share && 
      <div className="bg-base-300 bg-opacity-50 p-4 mt-4 rounded-lg text-base-content flex space-x-4 relative">
        <div>
          {ReactHtmlParser(post.share.content!)}
        </div>
        <div className="absolute -mt-6 right-0">
          <Avatar user={post.share.author} sz="sm" />
        </div>
      </div>
      }
    </div>
    <div
      className="
        flex flex-row 
        justify-around 
        py-4"
    >
      {post.content&&
        <PostItemFooter post={post} />
      }
      {post.share &&
        <ShareItemFooter sharedPost={post.share!} />
      }
    </div>
  </div>
);

export default MainPagePostListItem;
