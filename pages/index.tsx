import FeedItem from "components/containers/Feed/FeedItem"
import { CreatePostModalButton } from "components/containers/Post/CreatePostModal"
import MainLayout from "components/layouts/MainLayout"
import { CyfrLogo } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import useFeed from "hooks/useFeed"
import { PostStub } from "prisma/types"
import { uniqueKey } from "utils/helpers"
const {debug, jsonBlock} = useDebug('pages/index')


type HomePageProps = {}

const HomePage = (props:HomePageProps) => {
  const {feed} = useFeed('main')

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <CreatePostModalButton />
      {feed && feed.map((item:PostStub) => <FeedItem item={item} key={uniqueKey(item)} />)}
    </MainLayout>
  )
}

export default HomePage
