import { useEffect, useState } from "react"
import ReactHtmlParser from "react-html-parser"
import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { BookApi, ChapterApi } from '../../../prisma/prismaContext'
import { useToast } from "../../context/ToastContextProvider"
import { TailwindInput } from '../../forms'
import WritingFocusedEditor from "../../forms/WritingFocusedEditor"
import EZButton from "../../ui/ezButton"
import Spinner from "../../ui/spinner"
import CharacterList from "../Characters/CharacterList"
import ChapterFooter from "./ChapterFooter"

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

  const [title, setTitle] = useState<string|null>(null)
  const [content, setContent] = useState('')
  const [words, setWords] = useState(0)
  
  const onSave = async () => {
    debug('onSave')
    //TODO validate this natch
    const save = await chapterApi.save({title: title!, content: content!, words})
    if (save) {
      debug('save', save)
      notify(`Chapter saved!`)
      chapterApi.invalidate()
    } else {
      notify(`There was an error saving your content! :( ${save}`, 'warning')
    }
  }

  useEffect(() => {
    setTitle(() => chapterApi.chapterDetail?.title??'')
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
          <h2>{chapterApi.chapterDetail?.title}</h2>
          <CharacterList forBook={bookApi} />
          {ReactHtmlParser(chapterApi.chapterDetail.content??'')}
          <div>
            <ChapterFooter bookDetail={bookApi.bookDetail} chapters={bookApi.chapters} currentChapter={chapterApi.chapterDetail} />
          </div>
        </div>
      }
      {editView && bookApi.isAuthor && chapterApi.chapterDetail &&
        <div>

          <EZButton disabled={false} label="Save" onClick={onSave} />
          <h2>
            <TailwindInput type="text" value={title} setValue={setTitle} />
          </h2>
          <CharacterList forBook={bookApi} />
          <div className="relative max-h-max">
            <WritingFocusedEditor content={content} setContent={setContent} words={words} setWords={setWords} onSave={onSave} />
          </div>
        </div>
      }
      {reviewView && chapterApi.chapterDetail &&
        <div>
          <CharacterList forBook={bookApi}/>
          {ReactHtmlParser(chapterApi.chapterDetail?.content??'')}
        </div>
      }

      {/* TODO Add Gallery stuff cuz chapters need mood board yo */}
    </div>
  )
}

export default ChapterDetailComponent