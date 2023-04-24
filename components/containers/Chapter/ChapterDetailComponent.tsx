import { BookApi, ChapterApi } from '../../../prisma/prismaContext'

type ChapterDetailComponentProps = {
    bookApi: BookApi
    chapterApi: ChapterApi
}

const ChapterDetailComponent = ({bookApi, chapterApi}:ChapterDetailComponentProps) => {
  return (
    <div>ChapterDetailComponent</div>
  )
}

export default ChapterDetailComponent