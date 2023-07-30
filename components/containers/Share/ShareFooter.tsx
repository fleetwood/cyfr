
import useFeed from "hooks/useFeed"
import { PostDetail, PostStub, ShareStub, SharedPostStub } from "prisma/prismaContext"

import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import AvatarList from "components/ui/avatarList"
import { FeedIcon, HeartIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
import useApi from "prisma/useApi"
const { debug } = useDebug("PostItemFooter")

type ShareFooterProps = {
  share: ShareStub
  onUpdate?:  () => void
}
const ShareFooter = ({ share, onUpdate }: ShareFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const comments:PostStub[] = []
  const {invalidate} = useFeed('post')
  const { notify, notifyLoginRequired, notifyNotImplemented } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()
  const { reshare, like} = useApi.share()

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
    notifyNotImplemented()
  }

  const handleLike = async () => {
    debug(`handleLike`)
    if (!isLoggedIn()) return
    const liked = await like({creator: cyfrUser, share})
    notifyNotImplemented()
  }

  const handleShare = async () => {
    debug(`handleShare`)
    if (!isLoggedIn()) return
    const shared = await reshare({creator: cyfrUser, share})
    notifyNotImplemented()
  }

  return (
    <div className="flex flex-row justify-around py-4">
      <div>{ShareIcon}</div>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(0)})`}
          onClick={() => handleLike()}
        />
        {/* @ts-ignore */}
        {post.likes && <AvatarList users={post.likes} sz="xs" />}
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${abbrNum(0)})`}
          onClick={() => handleShare()}
        />
        {/* {post.shares &&
          <AvatarList users={post.shares} sz="xs" />
        } */}
      </div>

      <div className="font-semibold uppercase">
        {/* <CreateCommentFooterButton postId={post.id} comments={(post.commentThread?.comments??[]).length} /> */}
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.creator)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default ShareFooter
