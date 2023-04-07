import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'
import { PostFeed } from '../../../prisma/prismaContext'
import { timeDifference, uniqueKey } from '../../../utils/helpers'
import Avatar from '../../ui/avatar'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import PostItemFooter from './PostItemFooter'

type UserPostDetailProps = {
  post: PostFeed
}

const UserDetailPostItem = ({ post }: UserPostDetailProps) => 
    <div className="mt-4 p-4 rounded-2xl snap-always snap-start flex flex-col bg-neutral-content">
      <div className="">
        <Link href={`/post/${post.id}`} className="text-primary underline">
          {timeDifference(post.createdAt)}
        </Link>
      </div>
      <div className="p-4 mt-4">
        {post.content && ReactHtmlParser(post.content)}
        {post.post_comments && post.post_comments.length > 0 && (
          <div className="mt-4 text-sm font-semibold">⤵ Replies</div>
        )}
        {post.post_comments && post.post_comments.slice(0, 5).map((comment) => (
          <div 
            className="even:bg-base-300 odd:bg-base-200 bg-opacity-50 p-4 rounded-lg text-base-content mt-2 flex space-x-4"
            key={uniqueKey('post-comment',post, comment)}>
            <Avatar user={comment.author} sz="xs" />
            <>{ReactHtmlParser(comment.content!)}</>
          </div>
        ))}
        
        {post.images?.length > 0 && post.images[0] !== null &&
          <GalleryPhotoswipe images={post.images} />
        }
      
      </div>
      <div className="flex flex-row justify-around py-4">
        {post.content && <PostItemFooter post={post} feed="user" />}
      </div>
    </div>

export default UserDetailPostItem
