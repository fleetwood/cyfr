import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { BookApi, ChapterApi } from '../../../prisma/prismaContext'
import ReactHtmlParser from "react-html-parser"
import { InlineTextarea } from '../../forms'
import { LoggedIn } from '../../ui/toasty'

type ChapterDetailComponentProps = {
  bookApi: BookApi
  chapterApi: ChapterApi
  view?: ChapterViews
}

const ChapterDetailComponent = ({bookApi, chapterApi, view}:ChapterDetailComponentProps) => {
  const detailView = view === ChapterViews.DETAIL
  const editView = view === ChapterViews.EDIT
  const readView = view === ChapterViews.READ
  const reviewView = view === ChapterViews.REVIEW

  return (
    <div>
    {(detailView || readView) &&
      <div className='font-ibarra'>
        {ReactHtmlParser(chapterApi.content??'')}
      </div>
    }
    {editView &&
      <div>
        {bookApi.isAuthor &&
          <InlineTextarea content={chapterApi.content} />
        }
        {!bookApi.isAuthor &&
          <p>You do not have access to edit this content.</p>
        }
      </div>
    }
    {reviewView &&
      <div>
        {ReactHtmlParser(chapterApi.content??'')}
      </div>
    }
    </div>
  )
}

export default ChapterDetailComponent