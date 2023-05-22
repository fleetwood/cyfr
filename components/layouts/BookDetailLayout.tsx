import { useRef, useState } from "react"
import useBookQuery from "../../hooks/useBookQuery"
import { GenreStub, UserStub } from "../../prisma/prismaContext"
import BookDetailView from "../containers/Books/BookDetailView"
import Footer from "../containers/Footer"
import LeftColumn from "../containers/LeftColumn"
import Navbar from "../containers/Navbar"
import RightColumn from "../containers/RightColumn"
import { useCyfrUserContext } from "../context/CyfrUserProvider"
import { useToast } from "../context/ToastContextProvider"
import Section from "../ui/section"

export type BookDetailLayoutProps = {
  bookId: string
  genres: GenreStub[]
}

const BookDetailLayout = (props:BookDetailLayoutProps) => {
  const [cyfrUser] = useCyfrUserContext()
  // const bookDetailHook = useBookDetail(props.bookId, cyfrUser)
  const {data , isLoading, error} = useBookQuery(props.bookId)
  const bookDetail = data
  
  const [scrollActive, setScrollActive] = useState(false)
  const {toasts} = useToast()
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(() => position && position > 120 || false)
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

        <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
          {toasts.map((toast) => toast.toast)}
        </div>
        <Section
          className="box-border snap-y min-h-full"
          sectionTitle={bookDetail?.title}
          subTitle={bookDetail?.authors?.flatMap((a:UserStub) => a.name).join(' and ')}
        >
          <BookDetailView bookDetail={bookDetail} />
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
