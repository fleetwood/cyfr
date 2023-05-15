import GalleryPhotoswipe from "../../components/containers/Gallery/GalleryPhotoswipe";
import PostFooter from "../../components/containers/Post/PostFooter";
import MainLayout from "../../components/layouts/MainLayout";
import Avatar from "../../components/ui/avatar";
import HtmlContent from "../../components/ui/htmlContent";
import { PostDetail, PrismaPost } from "../../prisma/prismaContext";
import { timeDifference } from '../../utils/helpers';

type PostDetailPageProps = {
  post: PostDetail
}

export async function getServerSideProps(context: any) {
  const postid = context.params.id
  const post = await PrismaPost.postDetail(postid)

  return {
    props: {
      post,
    },
  }
}

const PostDetailPage = ({ post }:PostDetailPageProps) => {
  return (post && 
    <MainLayout
      pageTitle={`${post.author.name}`}
      sectionTitle=''
    >
      <div className="flex flex-row justify-between relative">
        <div className="flex justify-end w-full -mb-4 mr-4 z-10">
          <Avatar user={post.author} sz="lg" />
        </div>
      </div>
      <div className="bg-base-100 rounded-lg p-4 relative">
        <div className="absolute right-0 pr-4">
          Posted {timeDifference((post.createdat || '').toString())}
        </div>
        <HtmlContent content={post.content!} /> 
        {post.images?.length > 0 && post.images[0] !== null &&
          <GalleryPhotoswipe images={post.images} />
        }
        {/* {post.post_comments && post.post_comments.map(c => (
          <div className="text-base-content m-8 font-ibarra" key={uniqueKey('post-comment',post,c)}>
            {ReactHtmlParser(c.content!)}
          </div>
          ))} */}
         
        <PostFooter post={post} />
      </div>
    </MainLayout>
  )
}

export default PostDetailPage
