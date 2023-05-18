import Link from "next/link"
import { BookDetail, Chapter } from "../../../prisma/prismaContext"
import useDebug from "../../../hooks/useDebug"
import JsonBlock from "../../ui/jsonBlock"
import { uniqueKey } from "../../../utils/helpers"
import ShrinkableIconLink from "../../ui/shrinkableIconLink"
import { NextIcon, PrevIcon } from "../../ui/icons"

const {debug, jsonBlock} = useDebug('ChapterFooter')

type ChapterFooterProps = {
    bookDetail:         BookDetail
    chapters:           Chapter[]
    currentChapter?:    Chapter
}

const ChapterFooter = ({bookDetail, chapters, currentChapter}:ChapterFooterProps) => {
    const idx = chapters.findIndex(c => c.id === currentChapter?.id)

  return (
    <div className="flex flex-row justify-between bg-secondary text-secondary-content">
        {chapters && chapters.map((chapter, i) => 
            idx-1 === i ? (
                <ShrinkableIconLink icon={PrevIcon} label={chapter.title} href={`/book/${bookDetail.slug}/chapter/${chapter.id}`} key={uniqueKey(bookDetail, chapter)} />
                ) : idx + 1 === i ?(
                <ShrinkableIconLink icon={NextIcon} label={chapter.title} href={`/book/${bookDetail.slug}/chapter/${chapter.id}`} dir="left" key={uniqueKey(bookDetail, chapter)} />
            ) : null
        )}
        
        {jsonBlock({
            idx, 
            currentChapter: currentChapter?.title, 
            chapters: chapters.map(c => c.title)})}
    </div>
  )
}

export default ChapterFooter