import { CoverDetail, CoverStub, ImageDetail, ImageStub } from "prisma/prismaContext"

import { useToast } from "components/context/ToastContextProvider"
import AvatarList from "components/ui/avatarList"
import { CheckmarkIcon, HeartIcon, PhotoIcon, ShareIcon } from "components/ui/icons"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import useDebug from "hooks/useDebug"
import useApi from "prisma/useApi"
import { abbrNum } from "utils/helpers"
import { CreateCommentFooterButton } from "../Comment/CreateCommentModal"
const { debug } = useDebug("PostItemFooter")

type CoverFooterProps = {
  cover:      CoverDetail | CoverStub
  onUpdate?:  () => void
  selectable?:Boolean
  onSelect?:  (image: CoverDetail | CoverStub) => void
}
const CoverFooter = ({ cover, onUpdate, selectable = false, onSelect }: CoverFooterProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const { notify, notifyLoginRequired, notifyNotImplemented } = useToast()
  const {share, like} = useApi.image()

  const isLoggedIn = () => {
    if (!cyfrUser) {
      notifyLoginRequired()
      return false
    }
    return true
  }

  const update = () => {
    
    onUpdate ? onUpdate() : {}
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    notifyNotImplemented()
    // setPostId(post.id)
    // showComment()
    update()
  }

  const handleLike = async () => {
    if (!isLoggedIn()) return
    notifyNotImplemented()
    // const liked = await like({ imageId: cover.id, creatorId: cyfrUser!.id })
    // if (liked) {
    //   notify("You liked this image! ♥", "success")
    //   update()
    //   return
    // }
    // notify("Well that didn't work...", "warning")
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    notifyNotImplemented()
    // const shared = await share({ imageId: cover.id, creatorId: cyfrUser!.id })
    // if (shared) {
    //   notify("You shared this image...", "success")
    //   update()
    //   return
    // }
    // notify("Well that didn't work...", "warning")
  }

  return (cover && 
    <div className="flex flex-row justify-around">
      <div>{PhotoIcon}</div>
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={HeartIcon}
          className="hover:shadow-none"
          iconClassName="text-primary"
          labelClassName="text-primary"
          label={abbrNum(cover._count?.likes??0)}
          onClick={() => handleLike()}
        />
        {cover.likes && <AvatarList users={cover.likes} sz="xs" />}
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
        {/* {post.shares &&
          <AvatarList users={post.shares} sz="xs" />
        } */}
      </div>
      
      {selectable &&
      <div className="font-semibold uppercase">
        <ShrinkableIconButton
          icon={CheckmarkIcon}
          className="hover:shadow-none px-2"
          iconClassName="text-primary"
          onClick={() => onSelect ? onSelect(cover) : {}}
          />
      </div>
      }

      <div className="font-semibold uppercase">
        <CreateCommentFooterButton postId={cover.id} comments={(cover.commentThread?.comments??[]).length} />
        {/* <AvatarList
          users={(post.post_comments || []).map((a) => a.creator)}
          sz="xs"
        /> */}
      </div>
    </div>
  )
}

export default CoverFooter
