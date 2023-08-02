import { Avatar, Chip, Grid } from "@mui/material"
import { useToast } from "components/context/ToastContextProvider"
import { SocialTextarea } from "components/forms"
import UserAvatar from "components/ui/avatar/userAvatar"
import EZButton from "components/ui/ezButton"
import HtmlContent from "components/ui/htmlContent"
import { ReplyIcon } from "components/ui/icons"
import useFeed from "hooks/useFeed"
import { CreatorStub, PostDetail, PostStub } from "prisma/types"
import useApi from "prisma/useApi"
import useCommentApi from "prisma/useApi/comment"
import useCyfrUserApi from "prisma/useApi/cyfrUser"
import { useState } from "react"
import { timeDifference } from "utils/helpers"

type CommentThreadTypes = {
  postStub?:    PostStub
  postDetail?:  PostDetail
}

type CommentThreadStub = Comment & {
    creator: CreatorStub
}

const CommentThread = ({postStub, postDetail}:CommentThreadTypes) => {
  const {cyfrUser} = useApi.cyfrUser()
  const {addComment} = useApi.comment()
  const {invalidate} = useFeed('post')
  const {notify, notifyError} = useToast()
  const commentThread = 
    postStub ? postStub.commentThread : 
    postDetail ? postDetail.commentThread : 
    undefined

  const [comment, setComment] = useState<string|null>(null)

  const createComment = async () => {
    if (!commentThread || !comment) {
      notifyError()
      return
    }
    const result = await addComment({creatorId: cyfrUser.id, threadId: commentThread!.id, content: comment})
    if (result) {
      notify('Sending all the notifs!!')
      invalidate()
      return
    }
    notifyError()
  }

  return (
    <Grid container rowSpacing={2} columns={12}>
      <Grid xs={12}>
        <Avatar alt="Comments" sx={{bgcolor: 'info', height: 36, width: 36}} >{ReplyIcon}</Avatar>
      </Grid>
      <Grid xs={12}>
        <Grid xs={2}>
          <Chip
            color='info'
            sx={{paddingLeft: 0.5}}
            avatar={<UserAvatar user={cyfrUser} sz="xs" variant={['no-profile']}/>}
            label='Say a thing...'
            variant="filled"
          />
        </Grid>
        <Grid xs={9}>
          <SocialTextarea content={comment} setContent={setComment} />
          <EZButton label="Add Comment" variant="primary" onClick={createComment} />
        </Grid>
      </Grid>
      {commentThread?.comments && commentThread?.comments.map((comment:any) => (
      <Grid xs={12} container className="bg-base-100 even:bg-opacity-50 p-1 mt-1 rounded-md">
        <Grid xs={2}>
          <Chip
            color='info'
            sx={{paddingLeft: 0.5}}
            avatar={<UserAvatar user={comment.creator} sz="xs" variant={['no-profile']}/>}
            label={timeDifference(comment.updatedAt)}
            variant="outlined"
            />
        </Grid>
        <Grid xs={10}>
          <HtmlContent content={comment.content} className="text-sm" />
        </Grid>
      </Grid>
      ))}
    </Grid>
  )
}
export default CommentThread