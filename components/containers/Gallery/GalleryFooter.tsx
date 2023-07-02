import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"

import useDebug from "../../../hooks/useDebug"
import useFeed from "../../../hooks/useFeed"
import useGalleryApi from "../../../prisma/hooks/useGalleryApi"
import { GalleryDetail, GalleryStub } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import AvatarList from "../../ui/avatarList"

type GalleryFooterProps = {
  gallery:    GalleryDetail | GalleryStub
  onUpdate?:  () => void
}

const {debug} = useDebug('components/containers/Gallery/GalleryFooter')

const GalleryFooter = ({
  gallery,
  onUpdate
}: GalleryFooterProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const { invalidateFeed } = useFeed('gallery')
  const {like, share} = useGalleryApi()
  const { notify, loginRequired } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired()
      return false
    }
    return true
  }

  const update = () => {
    invalidateFeed('gallery')
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
        {/* <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Likes (${(gallery.likes||[]).length})`}
          onClick={() => handleLike()}
        />
        <AvatarList users={(gallery.likes||[])} sz="xs" /> */}
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (NI)`}
          onClick={() => handleShare()}
        />
        {/* <AvatarList users={(gallery.shares||[])} sz="xs" /> */}
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
