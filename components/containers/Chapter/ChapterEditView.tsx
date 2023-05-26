import React from 'react'
import { TailwindInput } from '../../forms'
import WritingFocusedEditor from '../../forms/WritingFocusedEditor'
import EZButton from '../../ui/ezButton'
import CharacterList from '../Characters/CharacterList'
import { ChapterDetail } from '../../../prisma/types'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import ChapterApi from '../../../prisma/api/chapterApi'
import ErrorPage from '../../../pages/404'

type ChapterEditViewProps = {
    chapterDetail:ChapterDetail
    onSave?:()=>void
}

const ChapterEditView = ({chapterDetail, onSave}:ChapterEditViewProps) => {
    const [cyfrUser] = useCyfrUserContext()
    const {isAuthor} = ChapterApi()

    //this should be a commune
  return  (
    isAuthor({chapter: chapterDetail, cyfrUser}) ? 
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
    : <ErrorPage message='You do not have edit permissions.' />
)}

export default ChapterEditView