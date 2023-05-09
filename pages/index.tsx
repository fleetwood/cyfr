import BookFeedView from "../components/containers/Books/BookFeedView"
import CharacterFeedView from "../components/containers/Characters/CharacterFeedView"
import FeedItem from "../components/containers/Feed/FeedItem"
import GalleryDetailView from "../components/containers/Gallery/GalleryDetailView"
import ImageStubView from "../components/containers/Image/ImageStubView"
import { CreatePostModalButton } from "../components/containers/Post/CreatePostModal"
import PostStubView from "../components/containers/Post/PostStubView"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import useFeed from "../hooks/useFeed"
import { MainFeed, PostStub, UserStub } from "../prisma/types"
import { uniqueKey, uuid } from "../utils/helpers"
const {debug, jsonBlock} = useDebug('pages/index', 'DEBUG')


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
      {feed && feed.map((item:MainFeed) => <FeedItem item={item} key={uniqueKey(item)} />)}
    </MainLayout>
  )
}

export default HomePage
