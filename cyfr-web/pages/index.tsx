import { Post } from ".prisma/client"
import type { GetServerSidePropsContext, NextPage } from "next"
import { useEffect, useState } from "react"
import PageStatus from "../components/containers/PageStatus"
import { useCyfrUser } from "../hooks/useCyfrUser"
import MainLayout from "../components/layouts/MainLayout"
import { useSession } from "../lib/next-auth-react-query"
import { Posts } from "../prisma/posts"
import { ResponseResult, ResponseError } from "../types/Response"
import { __prod__ } from "../utils/constants"
import { jsonify } from "../utils/log"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import { parseResult } from "../utils/api"

type HomePageProps = ResponseResult<Post[]>

const getPosts = async () => await Posts.all({ take: 25 })

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const posts = parseResult(await getPosts())
  return {
    props: {
      ...posts,
    },
  }
}

const Home = (props: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>()
  const [error, setError] = useState<ResponseError>()
  const [session] = useSession({required:false})
  const [cyfrUser,setCyfrUser]=useCyfrUser(null)
    // const { data, isLoading, isFetching } = useQuery("posts", getPosts);
  // if (!isLoading && !isFetching && data) {
  //   setPosts(data.result)
  // }


  useEffect(() => {
    if (props.result) {
      setPosts(props.result)
    }
    if (props.error) {
      setError(props.error)
    }
  }, [])

  return (
      <MainLayout
        className="scroll-smooth items-center justify-center top-0"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        {cyfrUser && <>
          <h1>Cyfr User {cyfrUser.name || 'Cyfr User has no name'}</h1>
        </>}
        <PageStatus watch={posts} error={error} />
        {posts && posts.map((post) => <MainPagePostListItem key={post.id} {...post} />)}
        {session && <pre>{jsonify(session)}</pre>}
      </MainLayout>
  )
}

export default Home
