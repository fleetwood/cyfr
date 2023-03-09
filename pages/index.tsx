import MainFeedItem from "../components/containers/Post/MainFeedItem"
import MainLayout from "../components/layouts/MainLayout"
import { CyfrLogo } from "../components/ui/icons"
import useFeed from "../hooks/useFeed"
import { uuid } from "../utils/helpers"

type HomePageProps = {}

const HomePage = (props:HomePageProps) => {
  const {feed} = useFeed({type: 'main'})

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <label htmlFor={'createPostModal'} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">New Post</span>
      </label>
      {feed && feed.map((item) => <MainFeedItem item={item} key={uuid()} />)}
    </MainLayout>
  )
}

export default HomePage
