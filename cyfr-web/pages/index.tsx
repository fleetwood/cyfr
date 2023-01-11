import { useEffect } from "react"
import CreatePost from "../components/containers/Post/CreatePost"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import MainLayout from "../components/layouts/MainLayout"
import useScrollPosition from "../components/ui/useScrollPosition"
import usePostsApi from "../hooks/usePostsApi"
import { __prod__ } from "../utils/constants"
import { log } from "../utils/log"

const Home = () => {
  const { posts, error, invalidate } = usePostsApi()
  const modalTitle = 'indexModal'
  const scrollPosition = useScrollPosition()

  // useEffect(() => {
    log(scrollPosition)
  // }, [scrollPosition])
  

  return (
    <MainLayout sectionTitle="Cyfr" subTitle="The Writer's Site">
      <label htmlFor={modalTitle} className="btn">New Post</label>
      {posts &&
        posts.map((post) => <MainPagePostListItem {...post} key={post.id} />)}
        <input type="checkbox" id={modalTitle} className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 shadow-none">
            <label htmlFor={modalTitle} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
            <CreatePost onCreate={() => invalidate()} />
          </div>
        </div>
    </MainLayout>
  )
}

export default Home
