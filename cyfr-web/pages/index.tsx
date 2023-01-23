import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import usePostsApi from "../hooks/usePostsApi"

const Home = () => {
  const { posts } = usePostsApi()

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <label htmlFor={'createPostModal'} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">New Post</span>
      </label>
      {posts && posts.map((post) => 
        <>
        <MainPagePostListItem post={post} key={post.id} />
        </>
      )}
    </MainLayout>
  )
}

export default Home
