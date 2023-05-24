import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"

import useFeed from "../../../hooks/useFeed"
import { PostDetail, PostStub, UserStub } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import PostApi from "../../../prisma/api/postApi"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
const { debug } = useDebug("PostItemFooter", 'DEBUG')

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
  const {sharePost, likePost} = PostApi()

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
    const liked = await likePost({ postId: post.id, authorId: cyfrUser!.id })
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
    const shared = await sharePost({ postId: post.id, authorId: cyfrUser!.id })
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
          label={`Like (${likes.length})`}
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
          label={`Share (${shares.length})`}
          onClick={() => handleShare()}
        />
        {/* @ts-ignore */}
        <AvatarList users={shares} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ReplyIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Comment (${comments.length})`}
          onClick={() => handleComment()}
        />
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.author)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default PostFooter
