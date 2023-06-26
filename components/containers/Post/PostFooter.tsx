import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"

import useFeed from "../../../hooks/useFeed"
import { PostDetail, PostStub, UserStub } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import usePostApi from "../../../prisma/hooks/usePostApi"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
import { abbrNum } from "utils/helpers"
const { debug } = useDebug("PostItemFooter")

type PostFooterProps = {
  post: PostDetail | PostStub
  onUpdate?:  () => void
}
const PostFooter = ({ post, onUpdate }: PostFooterProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const likes:UserStub[] = post?.likes?.filter(f=>f!==null)||[]
  const shares:UserStub[] = post?.shares?.filter(f=>f!==null)||[]
  const comments:PostStub[] = []
  const { invalidateFeed } = useFeed('post')
  const { notify, loginRequired } = useToast()
  const { setCommentId, showComment, hideComment } = useCommentContext()
  const {share, like} = usePostApi()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired()
      return false
    }
    return true
  }

  const update = () => {
    invalidateFeed()
    onUpdate ? onUpdate() : {}
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug(`handleComment`)
    setCommentId(post.id)
    showComment()
    update()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike`)
    const liked = await like({ postId: post.id, authorId: cyfrUser!.id })
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
    const shared = await share({ postId: post.id, authorId: cyfrUser!.id })
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
        {/* @ts-ignore */}
        <AvatarList users={likes} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Share (${abbrNum(shares.length)})`}
          onClick={() => handleShare()}
        />
        {/* @ts-ignore */}
        <AvatarList users={shares} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <CreateCommentFooterButton postId={post.id} comments={(post.post_comments??[]).length} />
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.author)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default PostFooter
