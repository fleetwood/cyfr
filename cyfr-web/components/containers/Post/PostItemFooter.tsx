import { Post } from ".prisma/client";
import { userAgent } from "next/server";
import usePostsApi from "../../../hooks/usePostsApi";
import { PostWithAuthor, PostWithDetails } from "../../../prisma/posts";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import AvatarList from "../../ui/avatarList";
import { HeartIcon, ShareIcon, ReplyIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../context/ToastContextProvider";
import { User } from "@prisma/client";

type PostItemFooterProps = {
  post: PostWithDetails;
};

const PostItemFooter = ({ post }: PostItemFooterProps) => {
  const { cyfrUser } = useCyfrUserContext();
  const { share, like, comment, invalidatePosts } = usePostsApi();
  const {notify} = useContext(ToastContext)
  const [shareAuthors, setShareAuthors] = useState<User[]>([])

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

  const handleComment = async () => {
    notify({type: 'warning', message: 'Not implemented'})
    return
    // await comment({
    //   postid: sharedPost.id,
    //   userid: cyfrUser.id,
    //   content: "Test",
    // })
  }

  const handleShare = async () => {
    if (!cyfrUser) {
      notify({
        type: "warning",
        message: "You need to login first...",
      })
    }

    const shared = await share({ postid: post.id, userid: cyfrUser!.id })
    if (shared) {
      notify({ type: "success", message: 'You shared this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  useEffect(() => {
    post.post_shares?.forEach(p => {
      const {id, name, image} = p.author
      setShareAuthors(s => [...s,p.author])
    })
  },[])

  return  (
    <>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={HeartIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Likes (${post.likes.length})`}
        onClick={() => handleLike()}
        />
        <AvatarList users={post.likes} sz="wee" />
      </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ShareIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Shares (${post.post_shares.length})`}
        onClick={() => handleShare()}
        />
        <AvatarList users={shareAuthors} sz="wee" />
    </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ReplyIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Comments (*)`}
        onClick={() => handleComment()}
        />
    </div>
    </>
)}

export default PostItemFooter;
