import React, { useState } from 'react'
import { TailwindInput } from '../../forms'
import WritingFocusedEditor from '../../forms/WritingFocusedEditor'
import EZButton from '../../ui/ezButton'
import CharacterList from '../Characters/CharacterList'
import { ChapterDetail } from '../../../prisma/types'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import useChapterApi from '../../../prisma/useApi/chapter'
import ErrorPage from '../../../pages/404'
import useDebug from '../../../hooks/useDebug'
import { useToast } from '../../context/ToastContextProvider'

const {debug} = useDebug('components/containers/Chapter/ChapterEditView', 'DEBUG')

type ChapterEditViewProps = {
    chapterDetail:ChapterDetail
    onSave?:()=>void
}

const ChapterEditView = ({chapterDetail, onSave}:ChapterEditViewProps) => {
    const {cyfrUser} = useCyfrUserContext()
    const {isAuthor, save} = useChapterApi()
    const {notify} = useToast()

    const [words, setWords] = useState(chapterDetail.words)
    const [title, setTitle] = useState(chapterDetail.title)
    const [content, setContent] = useState(chapterDetail.content)

    const onUpdate = async () => {
        debug('onUpdate', {words, title, content})
        const result = await save({
            ...chapterDetail,
            words,
            title,
            content
        })
        if (result) {
            notify(`${title} saved!`)
            onSave ? onSave() : {}
        } else {
            notify('wellhell', 'warning')
        }
    }

    //this should be a commune
  return  (
    isAuthor({chapter: chapterDetail, cyfrUser}) ? 
    <div>
        <EZButton disabled={title?.length<1} label="Save" onClick={onUpdate} />
        <h2>
        <TailwindInput type="text" value={title} setValue={setTitle} />
        </h2>
        <div>
        <h4>Characters</h4>
        <div className="font-bold text-lg">Book</div>
        {/* TODO: Find a good way to include all the characters for the book */}
        {/* <CharacterList characters={chapterDetail.book?.characters} /> */}
        <div className="font-bold text-lg">Chapter</div>
        <CharacterList characters={chapterDetail?.characters} />
        </div>
        <div className="relative max-h-max">
        <WritingFocusedEditor content={content} setContent={setContent} words={words} setWords={setWords} onSave={onUpdate} />
        </div>
    </div> 
    : <ErrorPage message='You do not have edit permissions.' />
)}

export default ChapterEditView