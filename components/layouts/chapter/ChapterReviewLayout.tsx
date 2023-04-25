import { useRef, useState } from "react"
import useBookApi from "../../../hooks/useBookApi"
import useChapterApi from "../../../hooks/useChapterApi"
import { ChapterLayoutProps } from "../../../pages/book/[bookId]/chapter/[chapterId]"
import ChapterDetailComponent from "../../containers/Chapter/ChapterDetailComponent"
import Footer from "../../containers/Footer"
import LeftColumn from "../../containers/LeftColumn"
import Navbar from "../../containers/Navbar"
import RightColumn from "../../containers/RightColumn"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import ChapterViewSelector from "../../containers/Chapter/ChapterViewSelector"
import EZButton from "../../ui/ezButton"
import Link from "next/link"

const ChapterReviewLayout = (props:ChapterLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const bookApi = useBookApi({bookDetail: props.bookDetail, cyfrUser})
  const chapterApi = useChapterApi({chapterDetail: props.chapterDetail, cyfrUser})
  const {notify} = useToast()
  //todo: This should be handled by a commune...
  // const isAuthor = (bookDetail?.author`s||[]).filter((a:UserStub) => a.id === cyfrUser?.id).length > 0
  
  const [scrollActive, setScrollActive] = useState(false)
  const {toasts} = useToast()
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(current => position && position > 120 || false)
  }

  return (
    <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
        <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-secondary to-neutral drawer">
          <LeftColumn />
        </div>
      </div>
      <main
        role="main"
        className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
        onScroll={handleScroll}
        ref={mainRef}
      >
        <Navbar className="min-w-full transition-all duration-200 ease-out" pageScrolled={scrollActive} />

        <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
            <div className="absolute right-0">
                <ChapterViewSelector setView={props.setView} view={props.view} showEdit={bookApi.isAuthor} />
            </div>
            {toasts.map((toast) => toast.toast)}
        </div>
        <div className="box-border snap-y min-h-full">
              <h3><Link href={`/book/${bookApi.bookDetail?.slug}`}>{bookApi.bookDetail?.title}</Link></h3>
          <ChapterDetailComponent bookApi={bookApi} chapterApi={chapterApi} view={props.view} />
        </div>
        <Footer />
      </main>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>
    </div>
  )
}

export default ChapterReviewLayout
