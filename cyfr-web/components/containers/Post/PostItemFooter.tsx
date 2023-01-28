import useCyfrUser from "../../../hooks/useCyfrUser"
import usePostsQuery from "../../../hooks/usePosts"
import { PostWithDetails } from "../../../prisma/types/post"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"
import { log } from "../../../utils/log"
import { useCommentContext } from "../../context/CommentContextProvider"

type PostItemFooterProps = {
  post: PostWithDetails
}

const PostItemFooter = ({ post }: PostItemFooterProps) => {
  const [ cyfrUser ] = useCyfrUser()
  const { share, like, invalidatePosts } = usePostsQuery()
  const {notify} = useToast()
  const {setCommentId, showComment, hideComment} = useCommentContext()
  
  const isLoggedIn = () => {
    if (!cyfrUser) {
      notify({
        type: "warning",
        message: <LoggedIn />,
      })
      return false
    }
    return true
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    const liked = await like({ postid: post.id, userid: cyfrUser!.id })
    if (liked) {
      notify({ type: "success", message: 'You liked this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  const handleComment = async () => {
    setCommentId(post.id)
    showComment()
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    const shared = await share({ postid: post.id, userid: cyfrUser!.id })
    if (shared) {
      notify({ type: "success", message: 'You shared this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

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
        <AvatarList users={post.likes} sz="xs" />
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
        <AvatarList users={post.post_shares.map(a => a.author)} sz="xs" />
    </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ReplyIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Comments (${post.post_comments.length})`}
        onClick={() => handleComment()}
        />
        <AvatarList users={post.post_comments.map(a => a.author)} sz="xs" />
    </div>
    </>
)}

export default PostItemFooter
