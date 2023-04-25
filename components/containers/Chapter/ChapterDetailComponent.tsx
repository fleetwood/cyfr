import ReactHtmlParser from "react-html-parser"
import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { BookApi, ChapterApi } from '../../../prisma/prismaContext'
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea } from '../../forms'
import { useEffect, useState } from "react"
import Spinner from "../../ui/spinner"

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

  const [content, setContent] = useState('')
  const [words, setWords] = useState(0)
  
  const onSave = async () => {
    debug('onSave')
    const save = await chapterApi.save({content: content!, words})
    if (save) {
      debug('save', save)
      notify(`Chapter saved! ${save}`)
    } else {
      notify(`There was an error saving your content! :( ${save}`, 'warning')
    }
  }

  useEffect(() => {
    setContent(() => chapterApi.chapterDetail?.content??'')
    setWords(() => chapterApi.chapterDetail?.words??0)
  }, [chapterApi.chapterDetail])

  return (
    <div>
      {chapterApi.isLoading && 
        <Spinner />
      }
      {(detailView || readView) && chapterApi.chapterDetail &&
        <div className='font-ibarra'>
          {ReactHtmlParser(chapterApi.chapterDetail.content??'')}
        </div>
      }
      {editView &&
        <div>
          {bookApi.isAuthor && chapterApi.chapterDetail &&
            <InlineTextarea content={content} setContent={setContent} words={words} setWords={setWords} onSave={onSave} />
          }
          {!bookApi.isAuthor && 
            <p>You do not have access to edit this content.</p>
          }
        </div>
      }
      {reviewView &&
        <div>
          {ReactHtmlParser(chapterApi.chapterDetail?.content??'')}
        </div>
      }
    </div>
  )
}

export default ChapterDetailComponent