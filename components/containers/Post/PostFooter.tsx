import useFeed from "hooks/useFeed"
import { PostDetail, PostStub } from "prisma/prismaContext"

import { Tooltip } from "@mui/material"
import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import AvatarList from "components/ui/avatarList"
import { FeedIcon, HeartIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import useApi from "prisma/useApi"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
const { debug } = useDebug("PostItemFooter")

type PostFooterProps = {
  post: PostDetail | PostStub
  onUpdate?:  () => void
}
const PostFooter = ({ post, onUpdate }: PostFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const comments:PostStub[] = []
  const {invalidate} = useFeed('post')
  const { notify, notifyLoginRequired } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()
  const {share, like} = useApi.post()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notifyLoginRequired()
      return false
    }
    return true
  }

  const update = () => {
    invalidate()
    onUpdate ? onUpdate() : {}
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug(`handleComment`)
    setPostId(post.id)
    showComment()
    update()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike`)
    const liked = await like({ postId: post.id, creatorId: cyfrUser!.id })
    if (liked) {
      notify("You liked this post!!!!!!!!!!!", "success")
      update()
      return
    }
    notify("Well that didn't work...", "warning")
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await share({ postId: post.id, creatorId: cyfrUser!.id })
    if (shared) {
      notify("You shared this post", "success")
      update()
      return
    }
    notify("Well that didn't work...", "warning")
  }

  return (
    <div className="flex flex-row justify-around py-4">
      <Tooltip title="Post">{FeedIcon}</Tooltip>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(post._count.likes)})`}
          onClick={() => handleLike()}
        />
        {/* @ts-ignore */}
        {post.likes && <AvatarList users={post.likes.map((like) => like.creator)} sz="xs" />}
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${abbrNum(post._count.shares)})`}
          onClick={() => handleShare()}
        />
        {post.shares &&
          <AvatarList users={post.shares.map((share) => share.creator)} count={post._count.shares} sz="xs" />
        }
      </div>

      <div className="font-semibold uppercase">
        <CreateCommentFooterButton postId={post.id} comments={(post.commentThread?.comments??[]).length} />
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.creator)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default PostFooter
