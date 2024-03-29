import { ImageDetail, ImageStub, LikeStub, PostImage, ShareStub } from "prisma/prismaContext"

import { useToast } from "components/context/ToastContextProvider"
import UserAvatarList from "components/ui/avatar/userAvatarList"
import { CheckmarkIcon, HeartIcon, PhotoIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import useApi from "prisma/useApi"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
const { debug } = useDebug("PostItemFooter")

type ImageFooterProps = {
  image:      PostImage | ImageDetail | ImageStub
  onUpdate?:  () => void
  selectable?:Boolean
  onSelect?:  (image: PostImage | ImageDetail | ImageStub) => void
  className?: string
  avatars?:   boolean
}
const ImageFooter = ({ image, onUpdate, selectable = false, onSelect, className, avatars }: ImageFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const {invalidate} = useApi.post().feed()
  const { notify, notifyLoginRequired } = useToast()
  const {share, like} = useApi.image()

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
    image && (
      <div className={`flex flex-row justify-around ${className}`}>
        <div className="font-semibold uppercase">
          <ShrinkableIconButton
            icon={HeartIcon}
            className="hover:shadow-none"
            iconClassName="text-primary"
            labelClassName="text-primary"
            label={abbrNum(image._count?.likes ?? 0)}
            onClick={() => handleLike()}
          />
          {avatars && image.likes && (
            <UserAvatarList
              users={image.likes.map((like: LikeStub) => like.creator)}
              sz="xs"
            />
          )}
        </div>

        <div className="font-semibold uppercase">
          <ShrinkableIconButton
            icon={ShareIcon}
            className="hover:shadow-none"
            iconClassName="text-primary"
            labelClassName="text-primary"
            label={abbrNum(0)}
            onClick={() => handleShare()}
          />
          {avatars && image.shares && (
            <UserAvatarList
              users={image.shares.map((share) => share.creator)}
              sz="xs"
            />
          )}
        </div>

        {selectable && (
          <div className="font-semibold uppercase">
            <ShrinkableIconButton
              icon={CheckmarkIcon}
              className="hover:shadow-none px-2"
              iconClassName="text-primary"
              onClick={() => (onSelect ? onSelect(image) : {})}
            />
          </div>
        )}

        {/* <div className="font-semibold uppercase">
          <CreateCommentFooterButton
            postId={image.id}
            comments={(image.commentThread?.comments ?? []).length}
          />
          <AvatarList
          users={(post.post_comments || []).map((a) => a.creator)}
          sz="xs"
        />
        </div> */}
      </div>
    )
  )
}

export default ImageFooter
