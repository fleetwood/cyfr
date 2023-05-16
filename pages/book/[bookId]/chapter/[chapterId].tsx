import { Dispatch, SetStateAction, useState } from "react"
import ChapterDetailLayout from "../../../../components/layouts/chapter/ChapterDetailLayout"
import ChapterReadLayout from "../../../../components/layouts/chapter/ChapterReadLayout"
import ChapterReviewLayout from "../../../../components/layouts/chapter/ChapterReviewLayout"
import useDebug from "../../../../hooks/useDebug"
import { BookDetail, ChapterDetail, GenreStub, PrismaBook, PrismaChapter, PrismaGenre } from "../../../../prisma/prismaContext"

const {debug, info} = useDebug('pages/book/[bookId]/chapter/[chapterId]')

export async function getServerSideProps(context: any) {
  const {bookId, chapterId} = context.params
  const {v} = context.query
  const bookDetail = await PrismaBook.detail(bookId)
  const chapterDetail = await PrismaChapter.detail(chapterId)
  const genres = await PrismaGenre.stubs()

  return {
    props: {
      bookDetail,
      chapterDetail,
      genres,
      v
    }
  }
}

export type ChapterServersideProps = {
  bookDetail:     BookDetail
  chapterDetail:  ChapterDetail
  genres:         GenreStub[]
  v?:             string
}

export type ChapterLayoutProps = ChapterServersideProps & {
  setView:        Dispatch<SetStateAction<ChapterViews>>
  view:           ChapterViews
}

export enum ChapterViews {
  DETAIL,
  EDIT,
  READ,
  REVIEW
}

const ChapterDetailPage = ({bookDetail, chapterDetail, genres, v}:ChapterServersideProps) => {
  const view = v && v === 'edit' ? ChapterViews.EDIT
    : v && v === 'read' ? ChapterViews.READ
    : v && v === 'review' ? ChapterViews.REVIEW
    : ChapterViews.DETAIL

  const [chapterView, setChapterView] = useState(view)
  
  return (
    chapterView == ChapterViews.DETAIL ? <ChapterDetailLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} /> 
    : chapterView === ChapterViews.READ ? <ChapterReadLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} /> 
    : <ChapterReviewLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} />
)}

export default ChapterDetailPage
