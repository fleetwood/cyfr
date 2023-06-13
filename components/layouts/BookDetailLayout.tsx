import { useRef, useState } from "react"
import useBookQuery from "../../hooks/useBookQuery"
import { BookDetail, GenreStub, UserStub } from "../../prisma/prismaContext"
import BookDetailView from "../containers/Books/BookDetailView"
import Footer from "../containers/Footer"
import LeftColumn from "../containers/LeftColumn"
import Navbar from "../containers/Navbar"
import RightColumn from "../containers/RightColumn"
import { useCyfrUserContext } from "../context/CyfrUserProvider"
import Section from "../ui/section"
import Toasts from "../ui/toasts"
import Spinner from "../ui/spinner"
import ErrorPage from "../../pages/404"
import useDebug from "../../hooks/useDebug"

const {debug} = useDebug('components/layouts/BookDetailLayout', 'DEBUG')

export type BookDetailLayoutProps = {
  // bookId?:    string
  bookSlug?:  string
  genres:     GenreStub[]
}

export type BookDetailProps = {
  bookDetail: BookDetail
  onUpdate?:  () => void
}

const BookDetailLayout = (props:BookDetailLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  // const bookDetailHook = useBookDetail(props.bookId, cyfrUser)
  const {data: bookDetail , isLoading, error, invalidate} = useBookQuery({bookSlug: props.bookSlug})
  
  const [scrollActive, setScrollActive] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(() => position && position > 120 || false)
  }

  const update = () => {
    debug('update')
    invalidate()
  }

  return (
    <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
      <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-secondary to-neutral">
        <LeftColumn />
      </div>
      <main
        role="main"
        className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
        onScroll={handleScroll}
        ref={mainRef}
      >
        <Navbar className="min-w-full transition-all duration-200 ease-out" pageScrolled={scrollActive} />
        <Toasts />
        <Section
          className="box-border snap-y min-h-full"
          sectionTitle={bookDetail?.title}
          subTitle={bookDetail?.authors?.flatMap((a:UserStub) => a.name).join(' and ')}
        >
          {error && <ErrorPage />}
          {isLoading && <Spinner />}
          {bookDetail && <BookDetailView bookDetail={bookDetail!} onUpdate={update} />}
        </Section>
        <Footer />
      </main>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>
    </div>
  )
}

export default BookDetailLayout
