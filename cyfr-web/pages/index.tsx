import { useContext } from "react"
import CreatePost from "../components/containers/Post/CreatePost"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import { ToastContext } from "../components/context/ToastContextProvider"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import usePostsApi from "../hooks/usePostsApi"

const Home = () => {
  const { posts, error, invalidatePosts } = usePostsApi()
  const {notify} = useContext(ToastContext)
  const createPostModal = 'createPostModal'

  const onCreate = () => {
    const modal = document.getElementById(createPostModal)
    // @ts-ignore
    modal!.checked = false
    invalidatePosts()
  }

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">

      <button className="btn btn-secondary p4 rounded-lg" onClick={() => notify({message: 'Testig notifs'})}>Notify</button>
      <label htmlFor={createPostModal} className="btn">New Post</label>
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
    </MainLayout>
  )
}

export default Home
