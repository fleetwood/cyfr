import { AuthorStub, BookDetail, GenreStub, UserStub } from "prisma/prismaContext"
import { useRef, useState } from "react"

import BookDetailView from "components/containers/Books/BookDetailView"
import Footer from "components/containers/Footer"
import LeftColumn from "components/containers/LeftColumn"
import RightColumn from "components/containers/RightColumn"
import Section from "components/ui/section"
import Toasts from "components/ui/toasts"
import ErrorPage from "pages/404"

import Spinner from "components/ui/spinner"
import useDebug from "hooks/useDebug"
import useApi from "prisma/useApi"
import Navbar from "components/containers/Navbar/Navbar"
const {debug} = useDebug('components/layouts/BookDetailLayout', )

export type BookDetailLayoutProps = {
  // bookId?:    string
  bookSlug:  string
  genres:     GenreStub[]
}

export type BookDetailProps = {
  bookDetail: BookDetail
  onUpdate?:  () => void
}

const BookDetailLayout = (props:BookDetailLayoutProps) => {
  const {cyfrUser} = useApi.cyfrUser()
  const {detailBySlug} = useApi.book()
  const {data: book, error, isLoading, invalidate} = detailBySlug(props.bookSlug)
  
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
        <Navbar 
          className="min-w-full transition-all duration-200 ease-out" 
          pageScrolled={scrollActive} />
        <Toasts />
        <Section
          className="box-border snap-y min-h-full"
          sectionTitle={book?.title}
          subTitle={book?.authors?.map((a:AuthorStub) => a.user).flatMap((a:UserStub) => a.name).join(' and ')}
        >
          {error && <ErrorPage />}
          {isLoading && <Spinner />}
          {book && <BookDetailView bookDetail={book!} onUpdate={update} />}
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
