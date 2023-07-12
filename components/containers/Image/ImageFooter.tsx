
import useFeed from "hooks/useFeed"
import { ImageDetail, ImageStub, PostDetail, PostStub, SharedPostStub } from "prisma/prismaContext"

import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import AvatarList from "components/ui/avatarList"
import { HeartIcon, PhotoIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import usePostApi from "prisma/hooks/usePostApi"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
import useImageApi from "prisma/hooks/useImageApi"
const { debug } = useDebug("PostItemFooter")

type ImageFooterProps = {
  image:      ImageDetail | ImageStub
  onUpdate?:  () => void
}
const ImageFooter = ({ image, onUpdate }: ImageFooterProps) => {
  const {cyfrUser} = useCyfrUserApi()
  const {invalidate} = useFeed('post')
  const { notify, notifyLoginRequired } = useToast()
  const {share, like} = useImageApi()

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
    debug(`handleComment Not Implemented`)
    // setPostId(post.id)
    // showComment()
    update()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug(`handleLike Not Implemented`)
    const liked = await like({ imageId: image.id, creatorId: cyfrUser!.id })
    if (liked) {
      notify("You liked this image! ♥", "success")
      update()
      return
    }
    notify("Well that didn't work...", "warning")
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare Not Implemented`)
    const shared = await share({ imageId: image.id, creatorId: cyfrUser!.id })
    if (shared) {
      notify("You shared this image...", "success")
      update()
      return
    }
    notify("Well that didn't work...", "warning")
  }

  return (
    <div className="flex flex-row justify-around py-4">
    <div>{PhotoIcon}</div>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${abbrNum(image._count.likes)})`}
          onClick={() => handleLike()}
        />
        {/* @ts-ignore */}
        {image.likes && <AvatarList users={image.likes} sz="xs" />}
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          // label={`Shares (${abbrNum(post._count.shares)})`}
          onClick={() => handleShare()}
        />
        {/* {post.shares &&
          <AvatarList users={post.shares} sz="xs" />
        } */}
      </div>

      <div className="font-semibold uppercase">
        <CreateCommentFooterButton postId={image.id} comments={(image.commentThread?.comments??[]).length} />
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.creator)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default ImageFooter
