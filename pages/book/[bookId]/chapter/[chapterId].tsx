import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ChapterDetailLayout from "../../../../components/layouts/chapter/ChapterDetailLayout"
import ChapterReadLayout from "../../../../components/layouts/chapter/ChapterReadLayout"
import ChapterReviewLayout from "../../../../components/layouts/chapter/ChapterReviewLayout"
import useCyfrUser from "../../../../hooks/useCyfrUser"
import useDebug from "../../../../hooks/useDebug"
import { ChapterDetail, GenreStub, PrismaChapter, PrismaGenre } from "../../../../prisma/prismaContext"
import ErrorPage from "../../../404"
import ChapterApi from "../../../../prisma/api/chapterApi"
import { currentView } from "../../../../components/containers/Chapter/ChapterViewSelector"

const {debug, info} = useDebug('pages/book/[bookId]/chapter/[chapterId]')

export type ChapterServersideProps = {
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

export async function getServerSideProps(context: any) {
  const {
    params: {chapterId}, 
    query: {v}
  } = context

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
  const view = 
    v && v === 'edit' ? ChapterViews.EDIT
    : v && v === 'read' ? ChapterViews.READ
    : v && v === 'review' ? ChapterViews.REVIEW
    : ChapterViews.DETAIL

    
  const [chapterView, setChapterView] = useState(view)
  const {readView, editView, detailView, reviewView} = currentView(chapterView)

  return chapterDetail ? (
    reviewView ? <ChapterReviewLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} />
    : readView || editView ? <ChapterReadLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} /> 
    : <ChapterDetailLayout view={chapterView} setView={setChapterView} chapterDetail={chapterDetail} genres={genres} /> 
  ) : (
    <ErrorPage error={{message: 'Did not load the chapter detail'}} />
  )
}

export default ChapterDetailPage
