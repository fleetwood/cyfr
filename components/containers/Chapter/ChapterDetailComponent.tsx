import ReactHtmlParser from "react-html-parser"
import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { BookApi, ChapterApi } from '../../../prisma/prismaContext'
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea } from '../../forms'

const {debug} = useDebug('ChapterDetailComponent', 'DEBUG')

type ChapterDetailComponentProps = {
  bookApi: BookApi
  chapterApi: ChapterApi
  view?: ChapterViews
}

const ChapterDetailComponent = ({bookApi, chapterApi, view}:ChapterDetailComponentProps) => {
  const {notify} = useToast()
  const detailView = view === ChapterViews.DETAIL
  const editView = view === ChapterViews.EDIT
  const readView = view === ChapterViews.READ
  const reviewView = view === ChapterViews.REVIEW

  const setContent = (content:string) => {
    debug('setContent', content)
    chapterApi.update({content})
  }
  
  const setWords = (words:number) => {
    debug('setWords', words)
    chapterApi.update({words})
  }
  
  const onContentSave = async () => {
    debug('onContentSave')
    const save = await chapterApi.save()
    if (save) {
      debug('save', save)
      notify(`Chapter saved! ${save}`)
    } else {
      notify(`There was an error saving your content! :( ${save}`, 'warning')
    }
  }

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
          <InlineTextarea content={chapterApi.content||''} setContent={setContent} words={chapterApi.words} setWords={setWords} onSave={onContentSave} />
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