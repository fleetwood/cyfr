import { Dispatch, SetStateAction, useState } from "react"
import ChapterDetailLayout from "../../../../components/layouts/chapter/ChapterDetailLayout"
import ChapterReadLayout from "../../../../components/layouts/chapter/ChapterReadLayout"
import ChapterReviewLayout from "../../../../components/layouts/chapter/ChapterReviewLayout"
import useCyfrUser from "../../../../hooks/useCyfrUser"
import useDebug from "../../../../hooks/useDebug"
import { ChapterDetail, GenreStub, PrismaChapter, PrismaGenre } from "../../../../prisma/prismaContext"
import ErrorPage from "../../../404"

const {debug, info} = useDebug('pages/book/[bookId]/chapter/[chapterId]')

export type ChapterServersideProps = {
  chapterDetail:  ChapterDetail
  genres:         GenreStub[]
  v?:             string
}

export type ChapterLayoutProps = ChapterServersideProps & {
  setView:        Dispatch<SetStateAction<ChapterViews>>
  view:           ChapterViews
  showEdit?:      boolean
}

export enum ChapterViews {
  DETAIL,
  EDIT,
  READ,
  REVIEW
}

export async function getServerSideProps(context: any) {
  const {chapterId} = context.params
  const {v} = context.query
  const chapterDetail = await PrismaChapter.detail(chapterId)
  const genres = await PrismaGenre.stubs()

  return {
    props: {
      chapterDetail,
      genres,
      v
    }
  }
}

const ChapterDetailPage = ({chapterDetail, genres, v}:ChapterServersideProps) => {
  const view = v && v === 'edit' ? ChapterViews.EDIT
    : v && v === 'read' ? ChapterViews.READ
    : v && v === 'review' ? ChapterViews.REVIEW
    : ChapterViews.DETAIL

  const [chapterView, setChapterView] = useState(view)
  const [cyfrUser] = useCyfrUser()
  
  return chapterDetail ? (
    chapterView == ChapterViews.DETAIL ? <ChapterDetailLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} showEdit /> 
    : chapterView === ChapterViews.READ ? <ChapterReadLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} showEdit /> 
    : <ChapterReviewLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} showEdit />
) : (
  <ErrorPage error={{message: 'Did not load the chapter detail'}} />
)
}

export default ChapterDetailPage
