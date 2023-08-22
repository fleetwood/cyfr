import FeedItem from "../components/containers/Feed/FeedItem"
import { CreatePostModalButton } from "../components/containers/Post/CreatePostModal"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import useFeed from "../hooks/useFeed"
import { MainFeed } from "../prisma/types"
import { domRef } from "../utils/helpers"
const {debug, jsonBlock} = useDebug('pages/index')


type HomePageProps = {}

const HomePage = (props:HomePageProps) => {
  const {feed} = useFeed({type: 'main'})

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <CreatePostModalButton />
      {feed && feed.map((item:MainFeed) => <FeedItem item={item} key={domRef(item)} />)}
    </MainLayout>
  )
}

export default HomePage
