import useFeed from "hooks/useFeed"
import { PostDetail, PostStub } from "prisma/prismaContext"

import { Tooltip } from "@mui/material"
import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import UserAvatarList from "components/ui/avatar/userAvatarList"
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
  const {send} = useApi.notif()

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
      send({userId: post.creator.id, notifType: 'LIKE', message: `
        <p>${cyfrUser.name} liked your <a href='/post/${post.id}'>Post</a>!</p>
      `})
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
      <div>
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(post._count.likes)})`}
          onClick={() => handleLike()}
        />
        {/* @ts-ignore */}
        {post.likes && 
          <UserAvatarList users={post.likes.map((like) => like.creator)} count={post.likes.length} sz="sm" />
        }
      </div>

      <div>
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${abbrNum(post._count.shares)})`}
          onClick={() => handleShare()}
        />
        {post.shares &&
          <UserAvatarList users={post.shares.map((share) => share.creator)} sz="sm" count={post.shares.length} />
        }
      </div>

      <div>
        <CreateCommentFooterButton postId={post.id} comments={(post.commentThread?.comments??[]).length} />
        {post.commentThread?.comments &&
        <UserAvatarList users={post.commentThread.comments.map(comment => comment.creator)} sz="sm" count={post.commentThread.comments.length} />
        }
      </div>

    </div>
  )
}

export default PostFooter
