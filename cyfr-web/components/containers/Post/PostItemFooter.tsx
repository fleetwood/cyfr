import { User } from "@prisma/client"
import { useEffect, useState } from "react"
import usePostsApi from "../../../hooks/usePostsApi"
import { PostWithDetails } from "../../../prisma/types/post"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import AvatarList from "../../ui/avatarList"
import { HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import { LoggedIn } from "../../ui/toasty"

type PostItemFooterProps = {
  post: PostWithDetails
}

const PostItemFooter = ({ post }: PostItemFooterProps) => {
  const { cyfrUser } = useCyfrUserContext()
  const { share, like, setCommentId, invalidatePosts } = usePostsApi()
  const {notify} = useToast()
  const [shareAuthors, setShareAuthors] = useState<User[]>([])
  
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

  const handleLike = async () => {
    if (!isLoggedIn()) return

    const liked = await like({ postid: post.id, userid: cyfrUser!.id })
    if (liked) {
      notify({ type: "success", message: 'You liked this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  const handleComment = async () => {
    if (!isLoggedIn()) return
    setCommentId(c => post.id)
    const commentModal = document.getElementById('commentPostModal')
    // @ts-ignore
    commentModal!.checked = true
  }

  const handleShare = async () => {
    if (!isLoggedIn()) return

    const shared = await share({ postid: post.id, userid: cyfrUser!.id })
    if (shared) {
      notify({ type: "success", message: 'You shared this post' })
      invalidatePosts()
      return
    }
    notify({ type: "warning", message: "Well that didn't work..." })
  }

  useEffect(() => {
    post.post_shares?.forEach(p => {
      const {id, name, image} = p.author
      setShareAuthors(s => [...s,p.author])
    })
  },[])

  return  (
    <>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={HeartIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Likes (${post.likes.length})`}
        onClick={() => handleLike()}
        />
        <AvatarList users={post.likes} sz="wee" />
      </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ShareIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Shares (${post.post_shares.length})`}
        onClick={() => handleShare()}
        />
        <AvatarList users={shareAuthors} sz="wee" />
    </div>
    <div className="font-semibold uppercase">
        <ShrinkableIconButton
        icon={ReplyIcon}
        className="bg-opacity-0 hover:shadow-none"
        iconClassName="text-primary"
        labelClassName="text-primary"
        label={`Comments (*)`}
        onClick={() => handleComment()}
        />
    </div>
    </>
)}

export default PostItemFooter
