import { Post } from ".prisma/client";
import { userAgent } from "next/server";
import usePostsApi from "../../../hooks/usePostsApi";
import { PostWithDetails } from "../../../prisma/posts";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import AvatarList from "../../ui/avatarList";
import { HeartIcon, ShareIcon, ReplyIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import { useContext } from "react";
import { ToastContext } from "../../context/ToastContextProvider";

type PostItemFooterProps = {
  post: PostWithDetails;
};

const PostItemFooter = ({ post }: PostItemFooterProps) => {
  const { cyfrUser } = useCyfrUserContext();
  const { share, like, comment, invalidatePosts } = usePostsApi();
  const {notify} = useContext(ToastContext)

  const handleLike = async () => {
    if (!cyfrUser) {
      notify({
        type: "warning",
        message: "You need to login to like a post",
      })
    }

    const liked = await like({ postid: post.id, userid: cyfrUser!.id })
    if (liked) {
      notify({ type: "success", message: 'You liked this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

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
        onClick={() => handleLike()}
        />
      }
      <AvatarList users={post.likes} sz="wee" />
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
      <AvatarList users={post.likes} sz="wee" />
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
