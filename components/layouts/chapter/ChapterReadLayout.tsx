import { useRef, useState } from "react"
import useBookApi from "../../../hooks/useBookApi"
import useChapterApi from "../../../hooks/useChapterApi"
import { ChapterLayoutProps } from "../../../pages/book/[bookId]/chapter/[chapterId]"
import ChapterDetailComponent from "../../containers/Chapter/ChapterDetailView"
import Footer from "../../containers/Footer"
import LeftColumn from "../../containers/LeftColumn"
import Navbar from "../../containers/Navbar"
import RightColumn from "../../containers/RightColumn"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import ChapterViewSelector from "../../containers/Chapter/ChapterViewSelector"
import { HamburgerIcon } from "../../ui/icons"
import Link from "next/link"

const ChapterReadLayout = (props:ChapterLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const bookApi = useBookApi({bookDetail: props.bookDetail, cyfrUser})
  const chapterApi = useChapterApi({chapterDetail: props.chapterDetail, cyfrUser})
  //todo: This should be handled by a commune...
  // const isAuthor = (bookDetail?.author`s||[]).filter((a:UserStub) => a.id === cyfrUser?.id).length > 0
  
  const [scrollActive, setScrollActive] = useState(false)
  const {toasts} = useToast()
  const mainRef = useRef<HTMLElement>(null)

  const sideBarDrawer = 'sideBarDrawer'
  const adBarDrawer = 'adBarDrawer'

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(current => position && position > 120 || false)
  }

  return (
    <div className="drawer">
      <input id={sideBarDrawer} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        
        <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
          <main
            role="main"
            className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
            onScroll={handleScroll}
            ref={mainRef}
          >
            <Navbar className="min-w-full transition-all duration-200 ease-out"
              leftChildren={<label htmlFor={sideBarDrawer} className="btn drawer-button">{HamburgerIcon}</label>}
            />

            <div className="absolute right-0">
                <ChapterViewSelector setView={props.setView} view={props.view} showEdit={bookApi.isAuthor} />
            </div>

            <div className="toast toast-top toast-center w-4/6 mt-12 z-10">
              {toasts.map((toast) => toast.toast)}
            </div>
            <div className="box-border snap-y min-h-full">
              <h3><Link href={`/book/${bookApi.bookDetail?.slug}`}>{bookApi.bookDetail?.title}</Link></h3>
              <ChapterDetailComponent bookApi={bookApi} chapterApi={chapterApi} view={props.view} />
            </div>
          </main>
        </div>

      </div> 

      <div className="drawer-side">
        <label htmlFor={sideBarDrawer} className="drawer-overlay"></label> 
        <div className="drawer w-[33%] bg-gradient-to-b from-secondary to-neutral">
          <label htmlFor={sideBarDrawer} className="btn btn-circle btn-sm drawer-button absolute right-0 top-0 z-10">X</label>
          <LeftColumn />
        </div>
      </div>

    </div>
  )
}

export default ChapterReadLayout
