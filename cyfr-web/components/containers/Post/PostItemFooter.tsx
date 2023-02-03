import useCyfrUser from "../../../hooks/useCyfrUser"
import usePostsQuery from "../../../hooks/usePosts"
// import { PostWithDetails } from "../../../prisma/types/post.def"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"
import { log } from "../../../utils/log"
import { useCommentContext } from "../../context/CommentContextProvider"

import { PostFeed } from "../../../prisma/prismaContext"
import JsonBlock from "../../ui/jsonBlock"
import useMainFeed from "../../../hooks/useMainFeed"

type PostItemFooterProps = {
  post: PostFeed
  feed: "main" | "user" | "default"
}
const PostItemFooter = ({ post, feed = "default" }: PostItemFooterProps) => {
  const [ cyfrUser ] = useCyfrUser()
  const { share, like, invalidatePosts } = usePostsQuery()
  // const { sharePost, likePost, invalidateMainFeed } = useMainFeed()
  const {notify} = useToast()
  const {setCommentId, showComment, hideComment} = useCommentContext()
  const isMain = feed === "main"
  
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

  const handleComment = async () => {
    log(`PostItemFooter.handleComment`)
    setCommentId(post.id)
    showComment()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    log(`PostItemFooter.handleLike`)
    const liked = await like({ postId: post.id, authorId: cyfrUser!.id })
    if (liked) {
      notify({ type: "success", message: 'You liked this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    log(`PostItemFooter.handleShare`)
    const shared = await share({ postId: post.id, authorId: cyfrUser!.id })
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
        label={`Like (${post.likes.length})`}
        onClick={() => handleLike()}
        />
        <AvatarList users={post.likes.map(p => p.author)} sz="xs" />
      </div>
      
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ShareIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Share (${post.shares.length})`}
        onClick={() => handleShare()}
        />
        <AvatarList users={post.shares.map(a => a.author)} sz="xs" />
    </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ReplyIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Comment (${(post.post_comments||[]).length})`}
        onClick={() => handleComment()}
        />
        <AvatarList users={(post.post_comments||[]).map(a => a.author)} sz="xs" />
    </div>
    </>
)}

export default PostItemFooter
