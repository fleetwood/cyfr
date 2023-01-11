import { useEffect, useRef } from "react"
import CreatePost from "../components/containers/Post/CreatePost"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import MainLayout from "../components/layouts/MainLayout"
import usePostsApi from "../hooks/usePostsApi"
import { __prod__ } from "../utils/constants"
import { log } from "../utils/log"

const Home = () => {
  const { posts, error, invalidate } = usePostsApi()
  const createPostModal = 'createPostModal'

  const onCreate = () => {
    const modal = document.getElementById(createPostModal)
    // @ts-ignore
    modal!.checked = false
    invalidate()
  }

  return (
    <MainLayout sectionTitle="Cyfr" subTitle="The Writer's Site">
      <label htmlFor={createPostModal} className="btn">New Post</label>
      {posts &&
        posts.map((post) => <MainPagePostListItem {...post} key={post.id} />)}
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
