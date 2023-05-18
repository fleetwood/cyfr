import { Dispatch, SetStateAction, useState } from "react"
import ChapterDetailLayout from "../../../../components/layouts/chapter/ChapterDetailLayout"
import ChapterReadLayout from "../../../../components/layouts/chapter/ChapterReadLayout"
import ChapterReviewLayout from "../../../../components/layouts/chapter/ChapterReviewLayout"
import useDebug from "../../../../hooks/useDebug"
import { BookDetail, ChapterDetail, GenreStub, PrismaBook, PrismaChapter, PrismaGenre } from "../../../../prisma/prismaContext"
import useChapterDetail, { ChapterDetailHook } from "../../../../hooks/useChapterDetail"
import useCyfrUser from "../../../../hooks/useCyfrUser"

const {debug, info} = useDebug('pages/book/[bookId]/chapter/[chapterId]')

export type ChapterServersideProps = {
  bookDetail: BookDetail
  chapterId:  string
  genres:     GenreStub[]
  v?:         string
}

export type ChapterLayoutProps = {
  chapterDetailHook:  ChapterDetailHook
  genres:             GenreStub[]
  setView:            Dispatch<SetStateAction<ChapterViews>>
  view:               ChapterViews
}

export enum ChapterViews {
  DETAIL,
  EDIT,
  READ,
  REVIEW
}

export async function getServerSideProps(context: any) {
  const {bookId, chapterId} = context.params
  const {v} = context.query
  const bookDetail = await PrismaBook.detail(bookId)
  const genres = await PrismaGenre.stubs()

  return {
    props: {
      bookDetail,
      chapterId,
      genres,
      v
    }
  }
}

const ChapterDetailPage = ({bookDetail, chapterId, genres, v}:ChapterServersideProps) => {
  const view = v && v === 'edit' ? ChapterViews.EDIT
    : v && v === 'read' ? ChapterViews.READ
    : v && v === 'review' ? ChapterViews.REVIEW
    : ChapterViews.DETAIL

  const [chapterView, setChapterView] = useState(view)
  const [cyfrUser] = useCyfrUser()
  const chapterDetailHook = useChapterDetail({bookDetail, chapterId, cyfrUser})
  
  return (
    chapterView == ChapterViews.DETAIL ? <ChapterDetailLayout view={chapterView} setView={setChapterView} chapterDetailHook={chapterDetailHook} genres={genres} /> 
    : chapterView === ChapterViews.READ ? <ChapterReadLayout view={chapterView} setView={setChapterView} chapterDetailHook={chapterDetailHook} genres={genres} /> 
    : <ChapterReviewLayout view={chapterView} setView={setChapterView} chapterDetailHook={chapterDetailHook} genres={genres} />
)}

export default ChapterDetailPage
