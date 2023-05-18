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

const ChapterDetailLayout = (props:ChapterLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {bookDetail, chapterDetail} = props.chapterDetailHook
  
  const [scrollActive, setScrollActive] = useState(false)
  const {toasts} = useToast()
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(() => position && position > 120 || false)
  }

  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap">
      <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-secondary to-neutral">
        <LeftColumn />
      </div>
      <main
        role="main"
        className="w-full flex flex-col m-0 overflow-auto scrollbar-hide relative"
        onScroll={handleScroll}
        ref={mainRef}
      >
        <Navbar className="w-full transition-all duration-200 ease-out" pageScrolled={scrollActive} />

        <div className="toast toast-top toast-center w-4/6 mt-10 z-12 p-0">
          {toasts.map((toast) => toast.toast)}
        </div>
        <div className="box-border snap-y min-h-full flex-1">
          <h3><Link href={`/book/${bookDetail?.slug}`}>{bookDetail?.title}</Link></h3>
          <ChapterViewSelector setView={props.setView} view={props.view} />
          {/* <ChapterDetailComponent bookApi={bookApi} chapterApi={chapterApi} view={props.view} /> */}
        </div>
        <Footer />
      </main>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>
    </div>
  )
}

export default ChapterDetailLayout
