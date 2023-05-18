import useDebug from "../../../hooks/useDebug"
import { BookDetail, Chapter } from "../../../prisma/prismaContext"
import { uniqueKey } from "../../../utils/helpers"
import { NextIcon, PrevIcon } from "../../ui/icons"
import ShrinkableIconLink from "../../ui/shrinkableIconLink"

const { debug, jsonBlock } = useDebug("ChapterFooter")

type ChapterFooterProps = {
  bookDetail: BookDetail
  chapters: Chapter[]
  currentChapter?: Chapter
  variant?: "horizontal" | "vertical"
}

const ChapterNav = ({
  bookDetail,
  chapters,
  currentChapter,
  variant = "horizontal",
}: ChapterFooterProps) => {
  const idx = chapters.findIndex((c) => c.id === currentChapter?.id)
  const classes = {
    horizontal: 'flex flex-row justify-between',
    vertical: 'flex flex-col w-fit space-y-2 p-2',
  }

  return (
    <div className={classes[variant]}>
      {chapters && chapters.map((chapter, i) =>
        idx - 1 === i ? (
          <ShrinkableIconLink
            icon={PrevIcon}
            label={chapter.title}
            className="btn-primary"
            href={`/book/${bookDetail.slug}/chapter/${chapter.id}`}
            key={uniqueKey(bookDetail, chapter)}
          />
        ) : idx + 1 === i ? (
          <ShrinkableIconLink
            icon={NextIcon}
            label={chapter.title}
            className="btn-primary text-primary-content"
            href={`/book/${bookDetail.slug}/chapter/${chapter.id}`}
            dir="left"
            key={uniqueKey(bookDetail, chapter)}
          />
        ) : null
      )}

      {jsonBlock({
        idx,
        currentChapter: currentChapter?.title,
        chapters: chapters.map((c) => c.title),
      })}
    </div>
  )
}

export default ChapterNav
