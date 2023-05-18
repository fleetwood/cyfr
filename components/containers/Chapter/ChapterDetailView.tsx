import ReactHtmlParser from "react-html-parser"
import { ChapterDetailHook } from "../../../hooks/useChapterDetail"
import useDebug from "../../../hooks/useDebug"
import ErrorPage from "../../../pages/404"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { useToast } from "../../context/ToastContextProvider"
import { TailwindInput } from '../../forms'
import WritingFocusedEditor from "../../forms/WritingFocusedEditor"
import EZButton from "../../ui/ezButton"
import Spinner from "../../ui/spinner"
import CharacterList from "../Characters/CharacterList"
import ChapterNav from "./ChapterNav"

const {debug} = useDebug('ChapterDetailComponent')

type ChapterDetailComponentProps = {
  chapterDetailHook:  ChapterDetailHook
  view?:              ChapterViews
}

const ChapterDetailComponent = ({chapterDetailHook, view}:ChapterDetailComponentProps) => {
  const {notify} = useToast()

  const detailView = view === ChapterViews.DETAIL
  const editView = view === ChapterViews.EDIT
  const readView = view === ChapterViews.READ
  const reviewView = view === ChapterViews.REVIEW

  const {
    chapterDetail, 
    bookDetail,
    api,
    state,
    query: {isLoading, error, invalidate}
  } = chapterDetailHook
  
  const onSave = async () => {
    debug('onSave')
    //TODO validate this natch
    const save = await api.save(chapterDetail!)
    if (save) {
      debug('save', save)
      notify(`Chapter saved!`)
      invalidate()
    } else {
      notify(`There was an error saving your content! :( ${save}`, 'warning')
    }
  }

  return error ? <ErrorPage /> : (
    <div>
      {isLoading && 
        <Spinner />
      }

      {(detailView || readView) && chapterDetail &&
        <div className='font-ibarra'>
          <h2>{chapterDetail.title}</h2>
          <div>
            <h4>Characters</h4>
            <CharacterList characters={chapterDetail.characters} />
          </div>
          {ReactHtmlParser(chapterDetail.content??'')}
          <div>
            <ChapterNav bookDetail={bookDetail} chapters={bookDetail.chapters??[]} currentChapter={chapterDetail} />
          </div>
        </div>
      }
      {editView && state.isAuthor && chapterDetail &&
        <div>

          <EZButton disabled={false} label="Save" onClick={onSave} />
          <h2>
            <TailwindInput type="text" value={state.title} setValue={state.setTitle} />
          </h2>
          <div>
            <h4>Characters</h4>
            <div className="font-bold text-lg">Book</div>
            <CharacterList characters={bookDetail?.characters} />
            <div className="font-bold text-lg">Chapter</div>
            <CharacterList characters={chapterDetail?.characters} />
          </div>
          <div className="relative max-h-max">
            <WritingFocusedEditor content={state.content} setContent={state.setContent} words={state.words} setWords={state.setWords} onSave={onSave} />
          </div>
        </div>
      }
      {reviewView && chapterDetail &&
        <div>
          <div>
            <h4>Characters</h4>
            <div className="font-bold text-lg">Chapter</div>
            <CharacterList characters={chapterDetail?.characters} />
          </div>
          {ReactHtmlParser(chapterDetail?.content??'')}
        </div>
      }

      {/* TODO Add Gallery stuff cuz chapters need mood board yo */}
    </div>
  )
}

export default ChapterDetailComponent