import ReactHtmlParser from "react-html-parser"
import { MainFeed, PostStub, UserStub } from "../../../prisma/prismaContext"
import PostItemFooter from "./PostItemFooter"

import useDebug from "../../../hooks/useDebug"
import UserInfo from "../../ui/userInfo"
const {debug, jsonBlock} = useDebug("MainFeedItem", 'DEBUG')

type PostFeedItemProps = {
  item: MainFeed
}

const PostFeedItem = ({item}:PostFeedItemProps) => {
  const {post, isShare, author} = item
  const comments:any[] = []

  return (
    <div className='
      mt-4 p-4 
      rounded-2xl
      snap-always snap-start
      flex flex-col
      bg-neutral-content 
      '>
        <div className="w-full">
        <UserInfo
          user={author as UserStub}
          sz="sm"
        />
        <>{ReactHtmlParser(post!.content||'')}</>
        {jsonBlock(post)}
        
        {comments && comments.length > 0 && <div className="mt-4 text-sm font-semibold">⤵ Replies</div>}
        
      </div>
      <div className="flex flex-row justify-around py-4">
        <PostItemFooter post={post! as PostStub} feed="main" />
      </div>
    </div>
  )
}

export default PostFeedItem
