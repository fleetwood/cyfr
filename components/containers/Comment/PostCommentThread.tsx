import { PostDetail, PostStub } from "prisma/types"

type CommentThreadTypes = {
  postStub?:    PostStub
  postDetail?:  PostDetail
}

const CommentThread = ({postStub, postDetail}:CommentThreadTypes) => {
  return (
    <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
  )
}
export default CommentThread