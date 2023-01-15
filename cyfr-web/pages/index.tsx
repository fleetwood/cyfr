import { useContext, useEffect, useRef } from "react"
import CreatePost from "../components/containers/Post/CreatePost"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import { ToastContext } from "../components/context/ToastContextProvider"
import MainLayout from "../components/layouts/MainLayout"
import usePostsApi from "../hooks/usePostsApi"
import { PostWithAuthor } from "../prisma/posts"
import { __prod__ } from "../utils/constants"
import { log } from "../utils/log"

const Home = () => {
  const { posts, error, invalidate } = usePostsApi()
  const {notify} = useContext(ToastContext)
  const createPostModal = 'createPostModal'

  const onCreate = () => {
    const modal = document.getElementById(createPostModal)
    // @ts-ignore
    modal!.checked = false
    invalidate()
  }

  return (
    <MainLayout sectionTitle="Cyfr" subTitle="The Writer's Site">
      <button className="btn btn-secondary" onClick={() => notify({
        message: 'Testing a much longer notification to see how it fits on the screen', 
        type: 'success'})}>Notify</button>
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
