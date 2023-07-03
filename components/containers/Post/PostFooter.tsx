
import useFeed from "hooks/useFeed"
import { Like, LikeStub, PostDetail, PostStub, User, UserStub } from "prisma/prismaContext"

import useDebug from "hooks/useDebug"
import usePostApi from "prisma/hooks/usePostApi"
import { abbrNum } from "utils/helpers"
import { useCommentContext } from "components/context/CommentContextProvider"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { useToast } from "components/context/ToastContextProvider"
import { HeartIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
import AvatarList from "components/ui/avatarList"
const { debug } = useDebug("PostItemFooter")

type PostFooterProps = {
  post: PostDetail | PostStub
  onUpdate?:  () => void
}
const PostFooter = ({ post, onUpdate }: PostFooterProps) => {
  const {cyfrUser} = useCyfrUserContext()
  const likes = post?.likes??[]
  // const shares:UserStub[] = post?.shares?.filter(f=>f!==null)||[]
  const comments:PostStub[] = []
  const [invalidate] = useFeed('post')
  const { notify, loginRequired } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()
  const {share, like} = usePostApi()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired()
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
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(likes.length)})`}
          onClick={() => handleLike()}
        />
        {likes &&
        <AvatarList users={likes} sz="xs" />
        }
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Share (NI)`}
          onClick={() => handleShare()}
        />
        {/* @ts-ignore */}
        {/* <AvatarList users={shares} sz="xs" /> */}
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
