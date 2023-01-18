import { Post } from ".prisma/client";
import { userAgent } from "next/server";
import usePostsApi from "../../../hooks/usePostsApi";
import { PostWithDetails } from "../../../prisma/posts";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import AvatarList from "../../ui/avatarList";
import { HeartIcon, ShareIcon, ReplyIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";

type PostItemFooterProps = {
  post: PostWithDetails;
};

const PostItemFooter = ({ post }: PostItemFooterProps) => {
  const { cyfrUser } = useCyfrUserContext();
  const { share, like, comment } = usePostsApi();

  return  (
    <>
    <div className="font-semibold uppercase">
      {cyfrUser &&
        <ShrinkableIconButton
        icon={HeartIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Likes (${post.likes.length})`}
        onClick={() => like({postid: post.id, userid: cyfrUser.id})}
        />
      }
      <AvatarList users={post.likes} />
      </div>
    <div className="font-semibold uppercase">
      {cyfrUser &&
        <ShrinkableIconButton
        icon={ShareIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Shares* (${post.likes.length})`}
        onClick={() => share({postid: post.id, userid: cyfrUser.id})}
        />
      }
      <AvatarList users={post.likes} />
    </div>
    <div className="font-semibold uppercase">
      {cyfrUser &&
        <ShrinkableIconButton
        icon={ReplyIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Comments (*)`}
        onClick={() => comment({postid: post.id, userid: cyfrUser.id, content: 'Test'})}
        />
      }
    </div>
    </>
)}

export default PostItemFooter;
