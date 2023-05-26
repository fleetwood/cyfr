import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import { ChapterDetail } from "../../../prisma/prismaContext"
import { useToast } from "../../context/ToastContextProvider"
import HtmlContent from "../../ui/htmlContent"
import CharacterList from "../Characters/CharacterList"
import ChapterEditView from "./ChapterEditView"
import ChapterNav from "./ChapterNav"

const {debug, jsonBlock} = useDebug('ChapterDetailView')

type ChapterDetailViewProps = {
  chapterDetail:  ChapterDetail
  view?:          ChapterViews
  showEdit?:     boolean
}

const ChapterDetailView = ({chapterDetail, view, showEdit=false}:ChapterDetailViewProps) => {
  const {notify} = useToast()

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
      {editView && showEdit && chapterDetail && <ChapterEditView chapterDetail={chapterDetail} />}
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