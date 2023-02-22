import useCyfrUser from "../../../hooks/useCyfrUser"
import { useCommentContext } from "../../context/CommentContextProvider"
import { useToast } from "../../context/ToastContextProvider"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"

import { GalleryDetail, GalleryFeed } from "../../../prisma/prismaContext"
import useFeed, { FeedTypes } from "../../../hooks/useFeed"
import useDebug from "../../../hooks/useDebug"

type GalleryFooterProps = {
  gallery: GalleryDetail | GalleryFeed
  feed: FeedTypes
}

const [debug] = useDebug('GalleryFooter')

const GalleryFooter = ({
  gallery,
  feed: { type = "gallery" },
}: GalleryFooterProps) => {
  const [cyfrUser] = useCyfrUser()
  const { shareGallery, likeGallery, invalidateFeed } = useFeed({ type })
  const { notify } = useToast()
  const { setCommentId, showComment, hideComment } = useCommentContext()
  const isMain = type === "main"

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notify({
        type: "warning",
        message: <LoggedIn />,
      })
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
      notify({ type: "success", message: "You liked this gallery!" })
      invalidateFeed()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    debug(`handleShare`)
    const shared = await shareGallery({
      galleryId: gallery.id,
      authorId: cyfrUser!.id,
    })
    if (shared) {
      notify({ type: "success", message: "You shared this post" })
      invalidateFeed()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  return (
    <div className="min-w-full p-4 flex justify-around space-x-4">
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Like (${gallery.likes.length})`}
          onClick={() => handleLike()}
        />
        {/* <AvatarList users={gallery.likes.map((p) => p.author)} sz="xs" /> */}
      </div>

      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={ShareIcon}
          className="bg-opacity-0 hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={`Share (${gallery.shares.length})`}
          onClick={() => handleShare()}
        />
        {/* <AvatarList users={gallery.shares.map((a) => a.author)} sz="xs" /> */}
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
