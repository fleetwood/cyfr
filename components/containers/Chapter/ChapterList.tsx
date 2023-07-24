import React, { useState, useRef } from "react"
import { BookDetailHook, Chapter, ChapterListItem, ChapterStub } from "../../../prisma/prismaContext"
import useDebug from "hooks/useDebug"
import Spinner from "components/ui/spinner"
import ModalCheckbox from "components/ui/modalCheckbox"

type ChapterListProps = {
    chapters:   ChapterListItem[]
    onSort? :   (chapter:ChapterListItem) => void
    onSelect?:  (chapter:ChapterListItem) => void
}

const {debug} = useDebug('containers/Chapter/ChapterList')

type DragProps = {
    chapter:Chapter, 
    index:number
}


const ChapterList = ({chapters, onSort, onSelect}:ChapterListProps) => {
  const [bookChapters, setBookChapters] = useState<ChapterListItem[]>(chapters??[])
  const [dragging, setDragging] = useState<boolean>(false)
  const dragItem = useRef<any>(null)
  const dragOverItem = useRef<any>(null)
  const spinnerModal = 'spinnerModal'

  // const handleDragEnter = (e:React.DragEvent<HTMLDivElement>, props:DragProps) => {
  //     debug('handleDragEnter')
  // }
  
  const showSpinnerModal = (show:boolean) => {
    const createModal = document.getElementById(spinnerModal)
    // @ts-ignore
    createModal!.checked = show
  }

  const handleSort = async (e:React.DragEvent<HTMLDivElement>,chapter:ChapterListItem) => {
    showSpinnerModal(true)
    const sortChapter = {...chapter, order: dragOverItem.current}
    // await bookDetailHook.api.sortChapters(sortChapter)
    dragItem.current = null
    dragOverItem.current = null
    setDragging(false)
    showSpinnerModal(false)
    if (onSort) onSort(sortChapter)
  }

  const getStyles = (index:number) => {
      const style = `text-primary-focus bg-opacity-20 bg-neutral hover:bg-primary hover:text-primary-content transition-colors duration-200 text-neutral-content border border-primary rounded-md italic`
      const over = `mt-10`
      // @ts-ignore
      return (dragItem.current === index) ? style : dragOverItem.current === index ? over : ''
  }

  const chapterItem = (chapter:ChapterListItem, index:number) => onSort !== undefined ? 
      <div draggable key={chapter.id}
      className={`text-lg font-semibold border border-neutral rounded-lg my-2 py-1 px-4 ${dragging ? getStyles(index) : ``}`}
      // onDragStart={(e) => { dragItem.current = index, setDragging(true) } }
      // onDragEnter={(e) => dragOverItem.current = index}
      // onDragEnd={(e) => handleSort(e, chapter)}
    >
      <div className="flex space-x-2">
        <span className="text-xs text-primary btn btn-circle btn-sm cursor-move ">{index+1}</span>
        <span className="cursor-pointer" onClick={() => onSelect ? onSelect(chapter) : {}}>{chapter.title}</span>
      </div>
    </div>
    : <div className="flex space-x-2">
      <span className="text-xs text-primary btn btn-circle btn-sm cursor-move ">{index+1}</span>
      <span className="cursor-pointer" onClick={() => onSelect ? onSelect(chapter) : {}}>{chapter.title}</span>
    </div>

  return (
    <div className="relative flex">
      <div>TODO: spinnerModal needs a manual toggle</div>
      <ul>
        {bookChapters.map((chapter:ChapterListItem, index:number) => chapterItem(chapter, index))}
      </ul>
        <ModalCheckbox id={spinnerModal} />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
            <div className="mb-3 rounded-xl w-full bg-primary text-primary-content md:bg-blend-hard-light md:bg-opacity-80">
              <Spinner />
            </div>
          </div>
        </div>
    </div>
  )
}

export default ChapterList

