import usePostQuery from "hooks/usePostQuery";
import GalleryPhotoswipe from "../../components/containers/Gallery/GalleryPhotoswipe";
import PostFooter from "../../components/containers/Post/PostFooter";
import MainLayout from "../../components/layouts/MainLayout";
import Avatar from "../../components/ui/avatar";
import HtmlContent from "../../components/ui/htmlContent";
import { timeDifference } from '../../utils/helpers';

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
  const {data, isLoading, error, invalidate} = usePostQuery(postId)
  const post = data

  return (post && 
    <MainLayout
      pageTitle={`${post.creator.name}`}
      sectionTitle=''
    >
      <div className="flex flex-row justify-between relative">
        <div className="flex justify-end w-full -mb-4 mr-4 z-10">
          <Avatar user={post.creator} sz="lg" />
        </div>
      </div>
      <div className="bg-base-100 rounded-lg p-4 relative">
        <div className="flex justify-end pr-4">Posted {timeDifference((post.createdat || '').toString())}</div>
        <HtmlContent className="clear-both" content={post.content!} /> 
        {post.images?.length > 0 && post.images[0] !== null && <GalleryPhotoswipe images={post.images} />}
        <PostFooter post={post} onUpdate={invalidate} />
      </div>
    </MainLayout>
  )
}

export default PostDetailPage
