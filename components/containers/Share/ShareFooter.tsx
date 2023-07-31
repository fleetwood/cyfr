
import useFeed from "hooks/useFeed"
import { ImageStub, PostDetail, PostStub, ShareStub, SharedPostStub } from "prisma/prismaContext"

import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import AvatarList from "components/ui/avatarList"
import { FeedIcon, HeartIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
import useApi from "prisma/useApi"
import { Tooltip, dividerClasses } from "@mui/material"
import ImageFooter from "../Image/ImageFooter"
import PostFooter from "../Post/PostFooter"
import BookFooter from "../Books/BookFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import CharacterFooter from "../Characters/CharacterFooter"
const { debug } = useDebug("PostItemFooter")

type ShareFooterProps = {
  share: ShareStub
  onUpdate?:  () => void
}
const ShareFooter = ({ share, onUpdate }: ShareFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const comments:PostStub[] = []
  const {invalidate} = useFeed('post')
  const { notify, notifyLoginRequired, notifyNotImplemented } = useToast()
  const { setPostId, showComment, hideComment } = useCommentContext()
  const { reshare, like} = useApi.share()

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
    debug(`handleComment`)
    notifyNotImplemented()
  }

  const handleLike = async () => {
    debug(`handleLike`)
    if (!isLoggedIn()) return
    const liked = await like({creator: cyfrUser, share})
    notifyNotImplemented()
  }

  const handleShare = async () => {
    debug(`handleShare`)
    if (!isLoggedIn()) return
    const shared = await reshare({creator: cyfrUser, share})
    notifyNotImplemented()
  }

  const title = share.book ?      "Shared Book" :
                share.character ? "Shared Character" :
                share.cover ?     "Shared Cover" :
                share.event ?     "Shared Event" :
                share.gallery ?   "Shared Gallery" :
                share.image ?     "Shared Image" :
                "Shared Post"

  return (
    <div className="flex flex-row justify-around py-4">
      <Tooltip title={title}>
        {ShareIcon}
        {/* {share.book && {BookIcon}}
        {share.character && {CharacterIcon}}
        {share.cover && {CoverIcon}}
        {share.event && {EventIcon}}
        {share.gallery && {GalleryIcon}}
        {share.image && {ImageIcon}}
        {share.post && {PostIcon}} */}
      </Tooltip>
      {share.book && <BookFooter bookStub={share.book} />}
      {share.character && <CharacterFooter character={share.character} />}
      {share.cover && <ImageFooter image={share.cover.image as ImageStub} />}
      {share.event && <div>TODO: Event Footer</div> }
      {share.gallery && <GalleryFooter gallery={share.gallery} />}
      {share.image && <ImageFooter image={share.image} />}
      {share.post && <PostFooter post={share.post} />}
    </div>
  )
}

export default ShareFooter
