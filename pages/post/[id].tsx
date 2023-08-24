import GalleryPhotoswipe from "components/containers/Gallery/GalleryImages"
import PostFooter from "components/containers/Post/PostFooter"
import MainLayout from "components/layouts/MainLayout"
import UserAvatar from "components/ui/avatar/userAvatar"
import HtmlContent from "components/ui/htmlContent"
import {UserTypes} from "prisma/types"
import useApi from "prisma/useApi"
import { timeDifference } from 'utils/helpers'

type PostDetailPageProps = {
  postId: string
}

export async function getServerSideProps(context: any) {
  const postId = context.params.id

  return {
    props: {
      postId,
    },
  }
}

const PostDetailPage = ({ postId }:PostDetailPageProps) => {
  const {data, isLoading, error, invalidate} = useApi.post().detail(postId)
  const post = data

  return (post && 
    <MainLayout
      pageTitle={`${post.creator.name}`}
      sectionTitle=''
    >
      <div className="flex flex-row justify-between relative">
        <div className="flex justify-end w-full -mb-4 mr-4 z-10">
          <UserAvatar user={post.creator} sz="lg" userType={post.creator.membership.type.name as UserTypes} />
        </div>
      </div>
      <div className="bg-base-100 rounded-lg p-4 relative">
        <div className="absolute right-0 pr-4">
          Posted {timeDifference((post.createdAt || '').toString())}
        </div>
        <HtmlContent content={post.content!} /> 
        {post.images?.length > 0 && post.images[0] !== null &&
          <GalleryPhotoswipe images={post.images} />
        }
        {/* {post.post_comments && post.post_comments.map(c => (
          <div className="text-base-content m-8 font-ibarra" key={domRef('post-comment',post,c)}>
            {ReactHtmlParser(c.content!)}
          </div>
          ))} */}
         
        <PostFooter post={post} />
      </div>
    </MainLayout>
  )
}

export default PostDetailPage
