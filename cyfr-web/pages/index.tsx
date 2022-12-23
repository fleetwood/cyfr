import { Post } from ".prisma/client"
import PageStatus from "../components/containers/PageStatus"
import { useCyfrUser } from "../hooks/useCyfrUser"
import MainLayout from "../components/layouts/MainLayout"
import { useSession } from "../lib/next-auth-react-query"
import { __prod__ } from "../utils/constants"
import { jsonify } from "../utils/log"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"

import { ResponseResult } from "../types/Response"
import usePostsApi from "../hooks/usePostApi"

type HomePageProps = ResponseResult<Post[]>

const Home = (props: HomePageProps) => {
  const [session] = useSession({required:false})
  const [cyfrUser,setCyfrUser]=useCyfrUser(null)
  const {posts, postsError, invalidatePosts} = usePostsApi();

  return (
      <MainLayout
        className="scroll-smooth items-center justify-center top-0 border border-primary"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        {cyfrUser && <>
          <h1>Cyfr User {cyfrUser.name || 'Cyfr User has no name'}</h1>
        </>}
        <PageStatus watch={posts} error={postsError} />
        <button className="px-4 py-2 rounded bg-secondary text-secondary-content" onClick={() => invalidatePosts()}>Fetch Again</button>
        {posts && posts.map((post) => <MainPagePostListItem key={post.id} {...post} />)}
        {session && 
          <>
          <h2>Session</h2>
          <pre>{jsonify(session)}</pre>
          </>
        }
      </MainLayout>
  )
}

export default Home
