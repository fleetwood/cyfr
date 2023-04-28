import Link from "next/link"
import { BookDetail, Chapter } from "../../../prisma/prismaContext"
import useDebug from "../../../hooks/useDebug"
import JsonBlock from "../../ui/jsonBlock"

const {debug} = useDebug('ChapterFooter', 'DEBUG')

type ChapterFooterProps = {
    bookDetail?:        BookDetail | null
    chapters:           Chapter[]
    currentChapter?:    Chapter
}

const ChapterFooter = ({bookDetail, chapters, currentChapter}:ChapterFooterProps) => {

    if (!bookDetail || bookDetail === null) {
        return <span>Nope</span>
    }

    const idx = chapters.findIndex(c => c.id === currentChapter?.id)
    const prev = idx && idx -1 >= 0 ? chapters[idx-1] : undefined
    const next = idx && idx < chapters.length ? chapters[idx+1] : undefined

  return (
    <div className="flex flex-row justify-between">
        {prev && 
            <Link href={`/book/${bookDetail.slug}/chapter/${prev.id}`}>{prev.title}</Link>
        }

        {next 
            ? <Link href={`/book/${bookDetail.slug}/chapter/${next.id}`}>{next.title}</Link>
            : <span>The End</span>
        }
        
        <JsonBlock data={{
            idx, 
            prev: idx -1 >= 0, 
            next: idx <= chapters.length, 
            chapter: currentChapter?.title, 
            chapters: chapters.map(c => c.title)}} />
    </div>
  )
}

export default ChapterFooter