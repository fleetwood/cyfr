import { PostWithAuthor } from "./../../../prisma/posts";
import { timeDifference } from "../../../utils/helpers";
import Avatar from "./../../ui/avatar";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons";
import { log } from "../../../utils/log";

const MainPagePostListItem = (post: PostWithAuthor) => {

  const likePost = () => {
    log('likePost',post.id)
  }
  
  const sharePost = () => {
    log('sharePost',post.id)
  }
  
  const replyPost = () => {
    log('replyPost',post.id)
  }

  return (
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
        <h1 className="h-title">{post.title}</h1>
        <div className="text-base-content">{post.content}</div>
      </div>

      <div className="
        flex flex-row 
        justify-around 
        py-4
        border-t 
        border-base-content 
        border-opacity-50">
        <ShrinkableIconButton 
          label="Like" 
          icon={HeartIcon} 
          className="bg-opacity-0 hover:shadow-none" 
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={likePost}
          />
        <ShrinkableIconButton 
          label="Share" 
          icon={ShareIcon} 
          className="bg-opacity-0 hover:shadow-none" 
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={sharePost}
          />
        <ShrinkableIconButton 
          label="Reply" 
          icon={ReplyIcon} 
          className="bg-opacity-0 hover:shadow-none" 
          iconClassName="text-primary"
          labelClassName="text-primary"
          onClick={replyPost}
          />
      </div>
    </div>
  );
};

export default MainPagePostListItem;
