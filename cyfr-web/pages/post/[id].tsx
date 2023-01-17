import Link from 'next/link'
import React from 'react'
import PostItemFooter from '../../components/containers/Post/PostItemFooter'
import MainLayout from '../../components/layouts/MainLayout'
import Avatar from '../../components/ui/avatar'
import { Posts, PostWithDetails } from '../../prisma/posts'
import { timeDifference } from '../../utils/helpers'

type PostDetailPageProps = {
    post: PostWithDetails
}

export async function getServerSideProps(context: any) {
    const postid = context.params.id;
    const post = await Posts.byId(postid);
  
    return {
      props: {
        post,
      },
    };
  }

const PostDetailPage = ({post}:PostDetailPageProps) => {
  return (
    <MainLayout
        pageTitle={`${post.author.name} : ${post.title}`}
        sectionTitle={post.title}
        subTitle={post.subtitle}
    >
        <div className="flex flex-row justify-between relative">
        <div className="flex justify-end w-full -mb-4 mr-4 z-10">
          <Avatar user={post.author} sz="lg" />
        </div>
      </div>
      <div className='bg-base-100 rounded-lg p-4 relative'>
        <div className='absolute right-0 pr-4'>
          Posted {timeDifference(post.createdAt)}
        </div>
        <div className="text-base-content m-8 font-ibarra">{post.content}</div>
        <div className="flex flex-row justify-around">
        <PostItemFooter post={post} />
      </div>
      </div>
    </MainLayout>
  )
}

export default PostDetailPage