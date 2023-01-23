import CreatePost from "../components/containers/Post/CreatePost"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import usePostsApi from "../hooks/usePostsApi"
import CommentPost from "../components/containers/Post/CommentPost"

const Home = () => {
  const { posts, error, invalidatePosts } = usePostsApi()
  const createPostModal = 'createPostModal'
  const commentPostModal = 'commentPostModal'

  const onCreate = () => {
    const createModal = document.getElementById(createPostModal)
    // @ts-ignore
    createModal!.checked = false
    invalidatePosts()
  }

  const onComment = () => {
    const commentModal = document.getElementById(commentPostModal)
    // @ts-ignore
    commentModal!.checked = false
    invalidatePosts()
  }

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">

      <label htmlFor={createPostModal} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">New Post</span>
      </label>
      {posts && posts.map((post) => 
        <MainPagePostListItem post={post} key={post.id} />
      )}

      <input type="checkbox" id={createPostModal} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-opacity-0 shadow-none">
          <label htmlFor={createPostModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <CreatePost onCreate={onCreate} />
        </div>
      </div>

      <input type="checkbox" id={commentPostModal} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-opacity-0 shadow-none">
          <label htmlFor={commentPostModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <CommentPost onComment={onComment} />
        </div>
      </div>
    </MainLayout>
  )
}

export default Home
