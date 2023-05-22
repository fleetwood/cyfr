import useDebug from "../../../hooks/useDebug"
import { BookDetail, BookStub, Chapter, ChapterDetail, ChapterStub } from "../../../prisma/prismaContext"
import { uniqueKey } from "../../../utils/helpers"
import { NextIcon, PrevIcon } from "../../ui/icons"
import ShrinkableIconLink from "../../ui/shrinkableIconLink"

const { debug, jsonBlock } = useDebug("ChapterFooter")

type ChapterFooterProps = {
  book: BookStub | BookDetail
  currentChapter?: Chapter | ChapterStub | ChapterDetail
  variant?: "horizontal" | "vertical"
}


const ChapterNav = ({
  book,
  currentChapter,
  variant = "horizontal",
}: ChapterFooterProps) => {
  const {chapters} = book
  const idx = chapters?.findIndex((c) => c.id === currentChapter?.id)
  const classes = {
    horizontal: 'flex flex-row justify-between',
    vertical: 'flex flex-col w-fit space-y-2 p-2',
  }

  return (
    <div className={classes[variant]}>
      {chapters && chapters.map((chapter, i) =>
        i - 1 === i ? (
          <ShrinkableIconLink
            icon={PrevIcon}
            label={chapter.title}
            className="btn-primary"
            href={`/book/${book.slug}/chapter/${chapter.id}`}
            key={uniqueKey(book, chapter)}
          />
        ) : i + 1 === i ? (
          <ShrinkableIconLink
            icon={NextIcon}
            label={chapter.title}
            className="btn-primary text-primary-content"
            href={`/book/${book.slug}/chapter/${chapter.id}`}
            dir="left"
            key={uniqueKey(book, chapter)}
          />
        ) : null
      )}

      {jsonBlock({
        idx,
        currentChapter: currentChapter?.title,
        chapters: chapters?.map((c) => c.title),
      })}
    </div>
  )
}

export default ChapterNav
