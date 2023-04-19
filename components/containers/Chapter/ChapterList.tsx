import React, { useState, useRef } from "react";
import { BookApi } from "../../../hooks/useBookApi";
import { Chapter } from "../../../prisma/prismaContext";
import useDebug from "../../../hooks/useDebug";

type ChapterListProps = {
    forBook: BookApi
}

const {debug} = useDebug('containers/Chapter/ChapterList', 'DEBUG')

type DragProps = {
    chapter:Chapter, 
    index:number
}

const ChapterList = ({forBook}:ChapterListProps) => {
    const [bookChapters, setBookChapters] = useState<Chapter[]>(forBook.chapters)
    const [dragging, setDragging] = useState<boolean>(false)
    const dragItem = useRef<any>(null)
    const dragOverItem = useRef<any>(null)
    
    // const handleDragEnter = (e:React.DragEvent<HTMLDivElement>, props:DragProps) => {
    //     debug('handleDragEnter')
    // }
    
    const handleSort = (e:React.DragEvent<HTMLDivElement>) => {
        let _bookChapters = [...bookChapters]
        const draggedItem = _bookChapters.splice(dragItem.current, 1)[0]
        _bookChapters.splice(dragOverItem.current, 0, draggedItem)
        setBookChapters(_bookChapters)
        dragItem.current = null
        dragOverItem.current = null
        setDragging(false)
    }

    const getStyles = (index:number) => {
      debug('getStyles')
        const style = `text-primary-focus bg-opacity-20 bg-neutral text-neutral-content border border-primary rounded-md italic`
        const over = `mt-10`
        // @ts-ignore
        return (dragItem.current === index) ? style : dragOverItem.current === index ? over : ''
    }

  return (
    <ul>
      {bookChapters.map((chapter:Chapter, index:number) => (
        // @ts-ignore
        <div draggable key={chapter.id} 
            className={`text-lg font-semibold cursor-move py-1 px-4 ${dragging ? getStyles(index):``}`} 
            onDragStart={(e) => {dragItem.current = index, setDragging(true)}}
            onDragEnter={(e) => dragOverItem.current = index}
            onDragEnd={(e) => handleSort(e)}
            >
            {chapter.title}
        </div>
      ))}
    </ul>
  )
};

export default ChapterList

