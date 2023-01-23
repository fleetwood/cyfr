import React from "react"
import PostItemFooter from "../../components/containers/Post/PostItemFooter"
import MainLayout from "../../components/layouts/MainLayout"
import Avatar from "../../components/ui/avatar"
import { timeDifference } from "../../utils/helpers"
import ReactHtmlParser from "react-html-parser"
import { PostWithDetails } from "../../prisma/types/post"
import { Posts } from "../../prisma/posts"

type PostDetailPageProps = {
  post: PostWithDetails
}

export async function getServerSideProps(context: any) {
  const postid = context.params.id
  const post = await Posts.byId(postid)

  return {
    props: {
      post,
    },
  }
}

const PostDetailPage = ({ post }: PostDetailPageProps) => {
  return (
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
          Posted {timeDifference(post.createdAt)}
        </div>
        {post.content && 
        <div className="text-base-content m-8 font-ibarra">
          {ReactHtmlParser(post.content)}
        </div>}
        <div className="flex flex-row justify-around">
          <PostItemFooter post={post} />
        </div>
      </div>
    </MainLayout>
  )
}

export default PostDetailPage
