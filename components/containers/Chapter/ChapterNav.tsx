import { PrevIcon, NextIcon } from "components/ui/icons"
import ShrinkableIconLink from "components/ui/shrinkableIconLink"
import useDebug from "hooks/useDebug"
import { Chapter, ChapterDetail, ChapterListItem, ChapterStub } from "prisma/prismaContext"
import { domRef } from "utils/helpers"

const { debug, jsonBlock } = useDebug("ChapterFooter")

type ChapterFooterProps = {
  bookSlug: string
  chapters: ChapterListItem[]
  currentChapter?: Chapter | ChapterStub | ChapterDetail
  variant?: "horizontal" | "vertical"
}


const ChapterNav = ({
  bookSlug,
  chapters,
  currentChapter,
  variant = "horizontal",
}: ChapterFooterProps) => {
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
            href={`/book/${bookSlug}/chapter/${chapter.id}`}
            key={domRef(chapter)}
          />
        ) : i + 1 === i ? (
          <ShrinkableIconLink
            icon={NextIcon}
            label={chapter.title}
            className="btn-primary text-primary-content"
            href={`/book/${bookSlug}/chapter/${chapter.id}`}
            dir="left"
            key={domRef(chapter)}
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
