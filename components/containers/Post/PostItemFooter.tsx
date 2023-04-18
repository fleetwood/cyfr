import { useCommentContext } from "../../context/CommentContextProvider";
import { useToast } from "../../context/ToastContextProvider";
import AvatarList from "../../ui/avatarList";
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import { LoggedIn } from "../../ui/toasty";

import useFeed from "../../../hooks/useFeed";
import { PostDetail, PostFeed } from "../../../prisma/prismaContext";

import useDebug from "../../../hooks/useDebug";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
const { debug } = useDebug("PostItemFooter");

type PostItemFooterProps = {
  post: PostDetail | PostFeed;
  feed: "main" | "user" | "post" | "share" | "default";
};
const PostItemFooter = ({ post, feed = "default" }: PostItemFooterProps) => {
  const [cyfrUser] = useCyfrUserContext();
  // const { sharePost, likePost, invalidateMainFeed } = useMainFeed()
  const { sharePost, likePost, invalidateFeed } = useFeed({ type: "post" });
  const { notify, loginRequired } = useToast();
  const { setCommentId, showComment, hideComment } = useCommentContext();
  const isMain = feed === "main";

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired();
      return false;
    }
    return true;
  };

  const handleComment = async () => {
    if (!isLoggedIn()) return;
    debug(`handleComment`);
    setCommentId(post.id);
    showComment();
  };

  const handleLike = async () => {
    if (!isLoggedIn()) return;

    debug(`handleLike`);
    const liked = await likePost({ postId: post.id, authorId: cyfrUser!.id });
    if (liked) {
      notify("You liked this post!!!!!!!!!!!", "success");
      invalidateFeed();
      return;
    }
    notify("Well that didn't work...", "warning");
  };

  const handleShare = async () => {
    if (!isLoggedIn()) return;

    debug(`handleShare`);
    const shared = await sharePost({ postId: post.id, authorId: cyfrUser!.id });
    if (shared) {
      notify("You shared this post", "success");
      invalidateFeed();
      return;
    }
    notify("Well that didn't work...", "warning");
  };

  return (
    <>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${(post.likes || []).length})`}
          onClick={() => handleLike()}
        />
        <AvatarList users={post.likes || []} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Share (${(post.shares || []).length})`}
          onClick={() => handleShare()}
        />
        <AvatarList users={post.shares || []} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ReplyIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Comment (${(post.post_comments || []).length})`}
          onClick={() => handleComment()}
        />
        <AvatarList
          users={(post.post_comments || []).map((a) => a.author)}
          sz="xs"
        />
      </div>
    </>
  );
};

export default PostItemFooter;
