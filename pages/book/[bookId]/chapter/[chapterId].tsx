import { Dispatch, SetStateAction, useState } from "react"
import useDebug from "../../../../hooks/useDebug"
import { BookDetail, ChapterDetail, GenreListItem, PrismaBook, PrismaChapter, PrismaGenre } from "../../../../prisma/prismaContext"
import ChapterReadLayout from "../../../../components/layouts/chapter/ChapterReadLayout"
import ChapterReviewLayout from "../../../../components/layouts/chapter/ChapterReviewLayout"
import ChapterDetailLayout from "../../../../components/layouts/chapter/ChapterDetailLayout"

const {debug, info} = useDebug('pages/book/[bookId]/chapter/[chapterId]', 'DEBUG')

export async function getServerSideProps(context: any) {
  const {bookId, chapterId} = context.params
  const bookDetail = await PrismaBook.detail(bookId)
  const chapterDetail = await PrismaChapter.detail(chapterId)
  const genres = await PrismaGenre.all()

  return {
    props: {
      bookDetail,
      chapterDetail,
      genres
    }
  }
}

export type ChapterServersideProps = {
  bookDetail: BookDetail
  chapterDetail:  ChapterDetail
  genres: GenreListItem[]
}

export type ChapterLayoutProps = ChapterServersideProps & {
  setView: Dispatch<SetStateAction<ChapterViews>>
  view: ChapterViews
}

export enum ChapterViews {
  DETAIL,
  READ,
  REVIEW
}

const ChapterDetailPage = ({bookDetail, chapterDetail, genres}:ChapterServersideProps) => {
  const [chapterView, setChapterView] = useState(ChapterViews.DETAIL)
  
  return (
    chapterView == ChapterViews.DETAIL ? <ChapterDetailLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} /> 
    : chapterView === ChapterViews.READ ? <ChapterReadLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} /> 
    : <ChapterReviewLayout view={chapterView} setView={setChapterView} bookDetail={bookDetail} chapterDetail={chapterDetail} genres={genres} />
)}

export default ChapterDetailPage
