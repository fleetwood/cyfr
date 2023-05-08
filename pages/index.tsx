import BookFeedView from "../components/containers/Books/BookFeedView"
import CharacterFeedView from "../components/containers/Characters/CharacterFeedView"
import GalleryFeedView from "../components/containers/Gallery/GalleryDetailView"
import ImageFeedView from "../components/containers/Image/ImageFeedView"
import { CreatePostModalButton } from "../components/containers/Post/CreatePostModal"
import PostFeedItem from "../components/containers/Post/PostFeed"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import useFeed from "../hooks/useFeed"
import { MainFeed, PostStub, UserStub } from "../prisma/types"
import { uuid } from "../utils/helpers"
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
      {feed && feed.map((item:MainFeed) => 
        <>
          {item.post && <PostFeedItem item={item} />}
          {item.image && <ImageFeedView item={item} />}
          {item.gallery && <GalleryFeedView item={item} />}
          {item.book && <BookFeedView item={item} />}
          {item.character && <CharacterFeedView item={item} />}
        </>
      )}
    </MainLayout>
  )
}

export default HomePage
