import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { isAuthor } from "../../../prisma/api/book"
import { ChapterDetail } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import { TailwindInput } from '../../forms'
import WritingFocusedEditor from "../../forms/WritingFocusedEditor"
import EZButton from "../../ui/ezButton"
import HtmlContent from "../../ui/htmlContent"
import CharacterList from "../Characters/CharacterList"
import ChapterNav from "./ChapterNav"

const {debug, jsonBlock} = useDebug('ChapterDetailView')

type ChapterDetailViewProps = {
  chapterDetail:  ChapterDetail
  view?:          ChapterViews
  showEdit?:     boolean
}

const ChapterDetailView = ({chapterDetail, view, showEdit=false}:ChapterDetailViewProps) => {
  const {notify} = useToast()
  const [cyfrUser] = useCyfrUserContext()

  const detailView = view === ChapterViews.DETAIL
  const editView = view === ChapterViews.EDIT
  const readView = view === ChapterViews.READ
  const reviewView = view === ChapterViews.REVIEW

  const onSave = async () => {
    debug('onSave')
    //TODO validate this natch
    // const save = await api.save(chapterDetail!)
    // if (save) {
    //   debug('save', save)
    //   notify(`Chapter saved!`)
    // } else {
    //   notify(`There was an error saving your content! :( ${save}`, 'warning')
    // }
  }

  return (
    <div>
      {(detailView || readView) && chapterDetail &&
        <div className='font-ibarra'>
          <h2>{chapterDetail.title}</h2>
          <div>
            <h4>Characters</h4>
            <CharacterList characters={chapterDetail.characters} />
          </div>
          <HtmlContent content={chapterDetail.content} />
          <div>
            <ChapterNav book={chapterDetail.book} currentChapter={chapterDetail}/>
          </div>
        </div>
      }
      {editView && showEdit && chapterDetail &&
        <div>

          <EZButton disabled={false} label="Save" onClick={onSave} />
          <h2>
            <TailwindInput type="text" value={chapterDetail.title} setValue={() => {}} />
          </h2>
          <div>
            <h4>Characters</h4>
            <div className="font-bold text-lg">Book</div>
            <CharacterList characters={chapterDetail.book?.characters} />
            <div className="font-bold text-lg">Chapter</div>
            <CharacterList characters={chapterDetail?.characters} />
          </div>
          <div className="relative max-h-max">
            <WritingFocusedEditor content={chapterDetail.content} setContent={() => {}} words={chapterDetail.words} setWords={() => {}} onSave={onSave} />
          </div>
        </div>
      }
      {(detailView || reviewView) && chapterDetail &&
        <div>
          <div>
            <h4>Characters</h4>
            <div className="font-bold text-lg">Chapter</div>
            <CharacterList characters={chapterDetail?.characters} />
          </div>
          <HtmlContent content={chapterDetail.content} />
        </div>
      }

      {/* TODO Add Gallery stuff cuz chapters need mood board yo */}
      {jsonBlock(chapterDetail)}
    </div>
)}

export default ChapterDetailView