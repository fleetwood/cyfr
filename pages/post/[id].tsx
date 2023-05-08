import { InferGetServerSidePropsType } from "next";
import ReactHtmlParser from "react-html-parser";
import GalleryPhotoswipe from "../../components/containers/Gallery/GalleryPhotoswipe";
import FeedFooter from "../../components/containers/Feed/FeedFooter";
import MainLayout from "../../components/layouts/MainLayout";
import Avatar from "../../components/ui/avatar";
import JsonBlock from "../../components/ui/jsonBlock";
import { PostStub, PrismaPost } from "../../prisma/prismaContext";
import { timeDifference } from '../../utils/helpers';

type PostDetailPageProps = {
  post: PostStub
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

const PostDetailPage = ({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        {post.content && 
        <div className="text-base-content m-8 font-ibarra">
          {ReactHtmlParser(post.content)}
          <JsonBlock data={post} />
        </div>}
        {/* {post.post_comments && post.post_comments.map(c => (
          <div className="text-base-content m-8 font-ibarra" key={uniqueKey('post-comment',post,c)}>
            {ReactHtmlParser(c.content!)}
          </div>
          ))} */}
          
        {post.images?.length > 0 && post.images[0] !== null &&
          <GalleryPhotoswipe images={post.images} />
        }

        <div className="flex flex-row justify-around">
          <FeedFooter post={post} feed="post" />
        </div>
      </div>
    </MainLayout>
  )
}

export default PostDetailPage
