import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"

import useFeed from "../../../hooks/useFeed"
import { LikeStub, MainFeed, Post, PostDetail, PostStub, ShareStub, UserStub } from "../../../prisma/prismaContext"

import useDebug from "../../../hooks/useDebug"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
const { debug } = useDebug("PostItemFooter")

type FeedFooterProps = {
  item: MainFeed
}
const FeedFooter = ({ item }: FeedFooterProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {post, gallery, image, book, character} = item
  const likes:UserStub[] = post?.likes || gallery?.likes || image?.likes || book?.likes || character?.likes || []
  const shares:UserStub[] = post?.shares || gallery?.shares || image?.shares || book?.shares || character?.shares || []
  const comments:(Post & {author: UserStub})[] = [] // post?.shares || gallery?.shares || image?.shares || book?.shares || character?.shares || []
  const { sharePost, likePost, invalidateFeed } = useFeed({ type: "post" })
  const { notify, loginRequired } = useToast()
  const { setCommentId, showComment, hideComment } = useCommentContext()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired()
      return false
    }
    return true
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug(`handleComment`)
    // setCommentId(post.id)
    showComment()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike`)
    // const liked = await likePost({ postId: post.id, authorId: cyfrUser!.id })
    // if (liked) {
    //   notify("You liked this post!!!!!!!!!!!", "success")
    //   invalidateFeed()
    //   return
    // }
    notify("Well that didn't work...", "warning")
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    // debug(`handleShare`)
    // const shared = await sharePost({ postId: post.id, authorId: cyfrUser!.id })
    // if (shared) {
    //   notify("You shared this post", "success")
    //   invalidateFeed()
    //   return
    // }
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

export default FeedFooter
