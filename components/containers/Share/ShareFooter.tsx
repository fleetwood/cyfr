
import useFeed from "hooks/useFeed"
import { ImageStub, PostStub, ShareStub } from "prisma/prismaContext"

import { Tooltip } from "@mui/material"
import { useCommentContext } from "components/context/CommentContextProvider"
import { useToast } from "components/context/ToastContextProvider"
import { ShareIcon } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import useApi from "prisma/useApi"
import BookFooter from "../Books/BookFooter"
import CharacterFooter from "../Characters/CharacterFooter"
import GalleryFooter from "../Gallery/GalleryFooter"
import ImageFooter from "../Image/ImageFooter"
import PostFooter from "../Post/PostFooter"
import CoverFooter from "../Cover/CoverFooter"
import ArticleFooter from "../Articles/ArticleFooter"
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

  const title = share.article ?   "Shared Article" :
                share.book ?      "Shared Book" :
                share.character ? "Shared Character" :
                share.cover ?     "Shared Cover" :
                // share.event ?     "Shared Event" :
                share.gallery ?   "Shared Gallery" :
                share.image ?     "Shared Image" :
                "Shared Post"

  return (
    <div>
      {share.article && <ArticleFooter article={share.article} invalidate={invalidate} />}
      {share.book && <BookFooter bookStub={share.book} />}
      {share.character && <CharacterFooter character={share.character} />}
      {share.image && <ImageFooter image={share.image} />}
      {share.cover && <CoverFooter cover={share.cover} />}
      {/* {share.event && <div>TODO: Event Footer</div> } */}
      {share.gallery && <GalleryFooter gallery={share.gallery} />}
      {share.post && <PostFooter post={share.post as PostStub} />}
    </div>
  )
}

export default ShareFooter
