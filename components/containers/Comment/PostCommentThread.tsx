import { Avatar, Chip, Grid } from "@mui/material"
import UserAvatar from "components/ui/avatar/userAvatar"
import HtmlContent from "components/ui/htmlContent"
import { ReplyIcon } from "components/ui/icons"
import { CreatorStub, PostDetail, PostStub } from "prisma/types"
import { timeDifference } from "utils/helpers"

type CommentThreadTypes = {
  postStub?:    PostStub
  postDetail?:  PostDetail
}

type CommentThreadStub = Comment & {
    creator: CreatorStub
}

const CommentThread = ({postStub, postDetail}:CommentThreadTypes) => {
  const commentThread = 
    postStub ? postStub.commentThread : 
    postDetail ? postDetail.commentThread : 
    undefined

  return (
    <Grid container rowSpacing={2} columns={12}>
      <Grid xs={12}>
        <Avatar alt="Comments" sx={{bgcolor: 'info', height: 36, width: 36}} >{ReplyIcon}</Avatar>
      </Grid>
      {commentThread?.comments && commentThread?.comments.map((comment:any) => (
      <Grid xs={12} container className="bg-base-100 even:bg-opacity-50 p-1 mt-1 rounded-md">
        <Grid xs={2}>
          <Chip
            color='info'
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