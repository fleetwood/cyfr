import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"

import useDebug from "../../../hooks/useDebug"
import useFeed, { FeedTypes } from "../../../hooks/useFeed"
import { GalleryDetail, GalleryStub } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import AvatarList from "../../ui/avatarList"

type GalleryFooterProps = {
  gallery: GalleryDetail | GalleryStub
  feed: FeedTypes
}

const {debug} = useDebug('components/containers/Gallery/GalleryFooter')

const GalleryFooter = ({
  gallery,
  feed: { type = "gallery" },
}: GalleryFooterProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const { shareGallery, likeGallery, invalidateFeed } = useFeed({ type })
  const { notify, loginRequired } = useToast()
  const { setCommentId, showComment, hideComment } = useCommentContext()
  const isMain = type === "main"

  const isLoggedIn = () => {
    if (!cyfrUser) {
      loginRequired()
      return false
    }
    return true
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    debug('handleComment')
    setCommentId(gallery.id)
    showComment()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return

    debug('handleLike')
    const liked = await likeGallery({
      galleryId: gallery.id,
      authorId: cyfrUser!.id,
    })
    if (liked) {
      notify("You liked this gallery!")
      invalidateFeed()
      return
    }
    notify(`Uh. Ya that didn't work. Weird.`,'warning')
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await shareGallery({
      galleryId: gallery.id,
      authorId: cyfrUser!.id,
    })
    if (shared) {
      notify("You shared this gallery!!!")
      invalidateFeed()
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
          label={`Likes (${(gallery.likes||[]).length})`}
          onClick={() => handleLike()}
        />
        <AvatarList users={(gallery.likes||[])} sz="xs" />
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Shares (${(gallery.shares||[]).length})`}
          onClick={() => handleShare()}
        />
        <AvatarList users={(gallery.shares||[])} sz="xs" />
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
          users={(gallery.comments || []).map((a) => a.author)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default GalleryFooter
