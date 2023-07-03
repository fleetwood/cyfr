import FeedItem from "components/containers/Feed/FeedItem"
import { CreatePostModalButton } from "components/containers/Post/CreatePostModal"
import MainLayout from "components/layouts/MainLayout"
import { CyfrLogo } from "components/ui/icons"
import Spinner from "components/ui/spinner"
import useDebug from "hooks/useDebug"
import useFeed from "hooks/useFeed"
import { uniqueKey } from "utils/helpers"
import ErrorPage from "./404"

const {debug, jsonBlock} = useDebug('pages/index', 'DEBUG')

const HomePage = () => {
  const [data, isLoading, error] = useFeed('post')

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <CreatePostModalButton />
      {isLoading && <Spinner size="md" center={true} />}
      {error && <ErrorPage message="Error loading feed" />}
      {!isLoading && !error && data && data.map((item:any, idx:number) => <FeedItem item={item} key={`feed-${idx}-${uniqueKey(item)}`} />)}
    </MainLayout>
  )
}

export default HomePage
