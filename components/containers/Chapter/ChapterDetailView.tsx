import useDebug from "../../../hooks/useDebug"
import { ChapterViews } from '../../../pages/book/[bookId]/chapter/[chapterId]'
import ChapterApi from "../../../prisma/api/chapterApi"
import { ChapterDetail } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import HtmlContent from "../../ui/htmlContent"
import CharacterList from "../Characters/CharacterList"
import ChapterEditView from "./ChapterEditView"
import ChapterNav from "./ChapterNav"
import { currentView } from "./ChapterViewSelector"

const {debug, jsonBlock} = useDebug('ChapterDetailView')

type ChapterDetailViewProps = {
  chapterDetail:  ChapterDetail
  view?:          ChapterViews
}

const ChapterDetailView = ({chapterDetail, view}:ChapterDetailViewProps) => {
  const {notify} = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {isAuthor} = ChapterApi()
  const showEdit = isAuthor({chapter: chapterDetail, cyfrUser})
  const {detailView, reviewView, editView, readView} = currentView(view)

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
      <div>
        <div>
          <h4>Characters</h4>
          <div className="font-bold text-lg">Chapter</div>
          <CharacterList characters={chapterDetail?.characters} />
        </div>
        <HtmlContent content={chapterDetail.content} />
      </div>
      {/* TODO Add Gallery stuff cuz chapters need mood board yo */}
      {jsonBlock(chapterDetail)}
    </div>
)}

export default ChapterDetailView