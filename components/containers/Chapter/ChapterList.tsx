import React, { useState, useRef } from "react";
import { Chapter } from "../../../prisma/prismaContext";
import useDebug from "../../../hooks/useDebug";
import { BookApi } from "../../../types/bookApi.def";
import Spinner from "../../ui/spinner";

type ChapterListProps = {
    forBook :   BookApi
    onSort? :   (chapter:Chapter) => void
    onSelect?:  (chapter:Chapter) => void
}

const {debug} = useDebug('containers/Chapter/ChapterList')

type DragProps = {
    chapter:Chapter, 
    index:number
}


const ChapterList = ({forBook, onSort, onSelect}:ChapterListProps) => {
    const [bookChapters, setBookChapters] = useState<Chapter[]>(forBook.chapters)
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

    const handleSort = async (e:React.DragEvent<HTMLDivElement>,chapter:Chapter) => {
      showSpinnerModal(true)
      const sortChapter = {...chapter, order: dragOverItem.current}
      await forBook.sortChapters(sortChapter)
      dragItem.current = null
      dragOverItem.current = null
      setDragging(false)
      showSpinnerModal(false)
      if (onSort) onSort(sortChapter)
    }

    const getStyles = (index:number) => {
        const style = `text-primary-focus bg-opacity-20 bg-neutral text-neutral-content border border-primary rounded-md italic`
        const over = `mt-10`
        // @ts-ignore
        return (dragItem.current === index) ? style : dragOverItem.current === index ? over : ''
    }

  return (
    <div className="relative flex">
      <ul>
        {bookChapters.map((chapter:Chapter, index:number) => {
          return (
            // @ts-ignore
            <div draggable key={chapter.id}
              className={`text-lg font-semibold border border-neutral rounded-lg my-2 py-1 px-4 ${dragging ? getStyles(index) : ``}`}
              onDragStart={(e) => { dragItem.current = index, setDragging(true); } }
              onDragEnter={(e) => dragOverItem.current = index}
              onDragEnd={(e) => handleSort(e, chapter)}
            >
              <div className="flex space-x-2">
                <span className="text-xs text-primary btn btn-circle btn-sm cursor-move ">{index+1}</span>
                <span onClick={() => onSelect ? onSelect(chapter) : {}}>{chapter.title}</span>
              </div>
            </div>
          );
        })}
      </ul>
        <input type="checkbox" id={spinnerModal} className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
            <div className="mb-3 rounded-xl w-full bg-primary text-primary-content md:bg-blend-hard-light md:bg-opacity-80">
              <Spinner />
            </div>
          </div>
        </div>
    </div>
  )
};

export default ChapterList

