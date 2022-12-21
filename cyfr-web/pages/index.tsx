import { Post } from ".prisma/client"
import type { GetServerSidePropsContext } from "next"
import { useEffect, useState } from "react"
import PageStatus from "../components/containers/PageStatus"
import { useCyfrUser } from "../hooks/useCyfrUser"
import MainLayout from "../components/layouts/MainLayout"
import { useSession } from "../lib/next-auth-react-query"
import { ResponseResult, ResponseError } from "../types/Response"
import { __prod__ } from "../utils/constants"
import { jsonify, log } from "../utils/log"
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem"
import { getApi } from "../utils/api"
import { useQueryClient } from "react-query"
import { usePostsApi, usePostsApiQuery } from "../hooks/usePostApi"

type HomePageProps = ResponseResult<Post[]>

const getPostsApi = async ():Promise<ResponseResult<Post[]>> => await getApi('/post')

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = await getPostsApi()
  return {
    props: {
      ...result,
    },
  }
}

const Home = (props: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>()
  const [responseError, setResponseError] = useState<ResponseError>()
  const [session] = useSession({required:false})
  const [cyfrUser,setCyfrUser]=useCyfrUser(null)
  
  const qc = useQueryClient()
  usePostsApi(
    (data:ResponseResult<Post[]>) => {
      log('usePostsApi success')
      if (data.result) {
        log('\tresult',data.result)
        setPosts(data.result)
      }
      else if (data.error) {
        log('\tERROR',data.error)
        setResponseError(data.error)
      }
    },
    (error:any) => {
      log('usePostsApiQuery ERROR',error)
    }
  )

  const refetch = () => {
    qc.invalidateQueries(usePostsApiQuery)
  }

  useEffect(() => {
    if (props.result) {
      setPosts(props.result)
    }
    if (props.error) {
      setResponseError(props.error)
    }
    log('useEffect',props)
  }, [])

  return (
      <MainLayout
        className="scroll-smooth items-center justify-center top-0 border border-primary"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        {cyfrUser && <>
          <h1>Cyfr User {cyfrUser.name || 'Cyfr User has no name'}</h1>
        </>}
        <PageStatus watch={posts} error={responseError} />
        <button className="px-4 py-2 rounded bg-secondary text-secondary-content" onClick={refetch}>Fetch Again</button>
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
