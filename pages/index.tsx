import Spinner from "components/ui/spinner"
import useDebug from "hooks/useDebug"
import useFeed from "hooks/useFeed"
import {PostStub} from "prisma/types"
import {domRef} from "utils/helpers"
import FeedItem from "../components/containers/Feed/FeedItem"
import {CreatePostModalButton} from "../components/containers/Post/CreatePostModal"
import MainLayout from "../components/layouts/MainLayout"
import ErrorPage from "./404"
const {debug, jsonBlock} = useDebug('pages/index')


const HomePage = () => {
  const {data, isLoading, error} = useFeed<PostStub[]>('post')

  return (
    <MainLayout>
      <CreatePostModalButton />
      {isLoading && <Spinner size="md" center={true} />}
      {error && <ErrorPage message="Error loading feed" />}
      {!isLoading && !error && data && data.map((item:any, idx:number) => <FeedItem post={item} key={`feed-${idx}-${domRef(item)}`} />)}
    </MainLayout>
  )
}

export default HomePage
