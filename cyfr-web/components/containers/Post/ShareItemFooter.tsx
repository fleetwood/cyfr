import { Post, User } from "@prisma/client";
import { useEffect, useState } from "react";
import useCyfrUser from "../../../hooks/useCyfrUser";
import usePostsQuery, { usePosts } from "../../../hooks/usePosts";
import { PostWithAuthor } from "../../../prisma/types/post";
import { useToast } from "../../context/ToastContextProvider";
import AvatarList from "../../ui/avatarList";
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import { LoggedIn } from "../../ui/toasty";
import { useCommentContext } from "../../context/CommentContextProvider";

type ShareItemFooterProps = {
  sharedPost: Post & {
    author: User;
    likes: User[];
  } & {
    post_shares: PostWithAuthor[];
  };
};

const ShareItemFooter = ({ sharedPost }: ShareItemFooterProps) => {
  const [ cyfrUser ] = useCyfrUser()
  const {share, like, invalidatePosts} = usePosts()
  const { notify } = useToast()
  const [shareAuthors, setShareAuthors] = useState<User[]>([])
  const {setCommentId, showComment, hideComment} = useCommentContext()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notify({
        type: "warning",
        message: <LoggedIn />,
      });
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!isLoggedIn()) return;

    const liked = await like({ postid: sharedPost.id, userid: cyfrUser!.id });
    if (liked) {
      notify({ type: "success", message: "You liked this post" });
      invalidatePosts();
      return;
    }
    notify({ type: "warning", message: "Well that didn't work..." });
  };

  const handleComment = async () => {
    setCommentId(sharedPost.id)
    showComment()
  };

  const handleShare = async () => {
    if (!isLoggedIn()) return;

    const shared = await share({ postid: sharedPost.id, userid: cyfrUser!.id });
    if (shared) {
      notify({ type: "success", message: "You shared this post" });
      invalidatePosts();
      return;
    }
    notify({ type: "warning", message: "Well that didn't work..." });
  };

  useEffect(() => {
    sharedPost.post_shares?.forEach((p) => {
      const { id, name, image } = p.author;
      setShareAuthors((s) => [...s, p.author]);
    });
  }, []);

  return (
    <>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Likes (${sharedPost.likes.length})`}
          onClick={() => handleLike()}
        />
        <AvatarList users={sharedPost.likes} sz="xs" />
      </div>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${sharedPost.post_shares.length})`}
          onClick={() => handleShare()}
        />
        <AvatarList users={shareAuthors} sz="xs" />
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
  );
};

export default ShareItemFooter;
