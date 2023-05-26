import Link from "next/link"
import { useRef, useState } from "react"
import { ChapterLayoutProps } from "../../../pages/book/[bookId]/chapter/[chapterId]"
import ChapterViewSelector from "../../containers/Chapter/ChapterViewSelector"
import Footer from "../../containers/Footer"
import LeftColumn from "../../containers/LeftColumn"
import Navbar from "../../containers/Navbar"
import RightColumn from "../../containers/RightColumn"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import ChapterDetailView from "../../containers/Chapter/ChapterDetailView"
import Toasts from "../../ui/toasts"

const ChapterReviewLayout = ({chapterDetail, view, setView}:ChapterLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {book} = chapterDetail
  
  const [scrollActive, setScrollActive] = useState(false)
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
        <Toasts />
        <div className="box-border snap-y min-h-full">
          <div className="absolute right-0">
            <ChapterViewSelector chapter={chapterDetail} setView={setView} view={view} />
          </div>
          <h3><Link href={`/book/${book?.slug}`}>{book?.title}</Link></h3>
          <ChapterDetailView chapterDetail={chapterDetail} view={view} />
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
