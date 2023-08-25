import Spinner from "components/ui/spinner"
import FeedItem from "../components/containers/Feed/FeedItem"
import {CreatePostModalButton} from "../components/containers/Post/CreatePostModal"
import MainLayout from "../components/layouts/MainLayout"
import {CyfrLogo} from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import useFeed from "../hooks/useFeed"
import {PostStub} from "../prisma/types"
import {domRef} from "../utils/helpers"
import ErrorPage from "./404"
import {SignIn, SignUp,UserButton} from "@clerk/nextjs"
const {debug, jsonBlock} = useDebug('pages/index')


const HomePage = () => {
  const {data, isLoading, error} = useFeed<PostStub[]>('post')

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
    <MainLayout sectionTitle={CyfrHome} subTitle="The Creative Site">
      <CreatePostModalButton />

      <SignIn />
      <SignUp />
      <UserButton afterSignOutUrl="/" />
      
      {isLoading && <Spinner size="md" center={true} />}
      {error && <ErrorPage message="Error loading feed" />}
      {!isLoading &&
        !error &&
        data &&
        data.map((item: any, idx: number) => (
          <FeedItem post={item} key={`feed-${idx}-${domRef(item)}`} />
        ))}
    </MainLayout>
  )
}

export default HomePage
