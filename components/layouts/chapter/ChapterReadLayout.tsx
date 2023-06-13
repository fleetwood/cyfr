import Link from "next/link"
import { useRef, useState } from "react"
import { ChapterLayoutProps } from "../../../pages/book/[bookSlug]/chapter/[chapterId]"
import ChapterDetailView from "../../containers/Chapter/ChapterDetailView"
import ChapterViewSelector, { currentView } from "../../containers/Chapter/ChapterViewSelector"
import LeftColumn from "../../containers/LeftColumn"
import Navbar from "../../containers/Navbar"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { HamburgerIcon } from "../../ui/icons"
import Toasts from "../../ui/toasts"
import ChapterEditView from "../../containers/Chapter/ChapterEditView"

const ChapterReadLayout = ({chapterDetail, view, setView}:ChapterLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {readView, editView} = currentView(view)

  const [scrollActive, setScrollActive] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const sideBarDrawer = 'sideBarDrawer'
  const adBarDrawer = 'adBarDrawer'

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(current => position && position > 120 || false)
  }

  const {book} = chapterDetail

  return (
    <div className="drawer">
      <input id={sideBarDrawer} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        
        <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
          <main
            role="main" ref={mainRef} onScroll={handleScroll} 
            className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
            >
            <Navbar className="min-w-full transition-all duration-200 ease-out"
              leftChildren={<label htmlFor={sideBarDrawer} className="btn drawer-button">{HamburgerIcon}</label>}
            />

            <div className="absolute right-0">
              <ChapterViewSelector chapter={chapterDetail} setView={setView} view={view} />
            </div>
            <Toasts />

            <div className="box-border snap-y min-h-full">
              <h3><Link href={`/book/${book?.slug}`}>{book?.title}</Link></h3>
              {readView && <ChapterDetailView chapterDetail={chapterDetail} view={view} />}
              {editView && <ChapterEditView chapterDetail={chapterDetail} />}
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
