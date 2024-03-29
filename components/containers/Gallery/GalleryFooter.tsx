import {useCommentContext} from "components/context/CommentContextProvider"
import {useToast} from "components/context/ToastContextProvider"
import UserAvatarList from "components/ui/avatar/userAvatarList"
import {HeartIcon,ReplyIcon,ShareIcon} from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import {GalleryDetail,GalleryStub} from "prisma/prismaContext"
import useApi from "prisma/useApi"
import {abbrNum} from "utils/helpers"

type GalleryFooterProps = {
  gallery:    GalleryDetail | GalleryStub
  onUpdate?:  () => void
}

const {debug} = useDebug('components/containers/Gallery/GalleryFooter')

const GalleryFooter = ({
  gallery,
  onUpdate
}: GalleryFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const {feed, like, share} = useApi.gallery()
  const {invalidate} = feed()
  const { notify, notifyLoginRequired } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notifyLoginRequired()
      return false
    }
    return true
  }

  const update = () => {
    invalidate ? invalidate() : {}
    onUpdate ?  onUpdate() : {}
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug('handleComment')
    notify('Not implemented')
    // setPostId(gallery.id)
    showComment()
    update()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug('handleLike')
    const liked = await like({
      galleryId: gallery.id,
      creatorId: cyfrUser!.id,
    })
    if (liked) {
      notify("You liked this gallery!")
      update()
      return
    }
    notify(`Uh. Ya that didn't work. Weird.`,'warning')
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await share({
      galleryId: gallery.id,
      creatorId: cyfrUser!.id,
    })
    if (shared) {
      notify("You shared this gallery!!!")
      update()
      return
    }
    notify(`Uh. Ya that didn't work. Weird.`,'warning')
  }

  return (
    <div className="min-w-full p-4 flex justify-around space-x-4">
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Likes (${abbrNum(gallery._count.likes)})`}
          onClick={() => handleLike()}
        />
        <UserAvatarList users={[]} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${abbrNum(gallery._count.shares)})`}
          onClick={() => handleShare()}
        />
        <UserAvatarList users={[]} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ReplyIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          // label={`Comment (${(gallery.comments || []).length})`}
          label={`Comment (*)`}
          // onClick={() => handleComment()}
        />
        {/* <AvatarList
          users={(gallery.comments || []).map((a) => a.creator)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default GalleryFooter
