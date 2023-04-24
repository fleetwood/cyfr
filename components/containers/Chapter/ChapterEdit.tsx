import { useState } from "react"
import useChapterApi from "../../../hooks/useChapterApi"
import useDebug from "../../../hooks/useDebug"
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea } from "../../forms"
import { ChapterApiProps } from "../../../prisma/prismaContext"

const {debug} = useDebug('components/containers/Chapter/ChapterEdit', 'DEBUG')

/**
 * 
 * @param props         {@link ChapterApiProps}
 * @property chapterId  string
 * @property cyfrUser   {@link CyfrUser} | undefined
 */
const ChapterEdit = (props: ChapterApiProps) => {
  const chapter = useChapterApi(props)
  const {notify} = useToast()

  const [content, setContent] = useState<string>(chapter.content||'')

  const saveContent = async () => {
    chapter.update({content})
    const update = await chapter.save()
    if (update) {
        notify(`Updated ${chapter.title}!`)
    }
  }

  return (
    <div>
      <h2>{chapter.title}</h2>
      <InlineTextarea content={content} setContent={setContent} onSave={saveContent} />
    </div>
  )
}

export default ChapterEdit
