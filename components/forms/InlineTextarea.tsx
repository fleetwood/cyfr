import { CountExtension } from "@remirror/extension-count"
import { Node } from "@remirror/pm/dist-types/model"
import {
  EditorComponent,
  EmojiPopupComponent,
  MentionAtomPopupComponent,
  MentionAtomState,
  Remirror,
  useRemirror
} from "@remirror/react"
import dynamic from "next/dynamic"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import {
  prosemirrorNodeToHtml, RemirrorEventListenerProps
} from "remirror"
import {
  BoldExtension, EmojiExtension, ItalicExtension,
  MentionAtomExtension, MentionAtomNodeAttributes, PlaceholderExtension
} from "remirror/extensions"
import data from "svgmoji/emoji.json"
import useDebug from "../../hooks/useDebug"
import { useCyfrUserContext } from "../context/CyfrUserProvider"
const {debug, todo} = useDebug("RemirrorEditor")

type MentionItem = { id: string, label: string }

type InlineTextareaProps = {
  placeholder?: string
  content?: string | null
  setContent?: Dispatch<SetStateAction<string | null>>
  setValid?: Dispatch<SetStateAction<boolean>>
  setCounter?: Dispatch<SetStateAction<number>>
  maxChar?: number
}

const InlineTextarea = ({
  placeholder,
  content,
  setContent,
  maxChar = -1,
  setValid,
}: InlineTextareaProps) => {
  const [ cyfrUser ] = useCyfrUserContext()
  const [count, setCount] = useState(-1)
  const [perc, setPerc] = useState(0)

  let extensions = [
    new BoldExtension(),
    new ItalicExtension(),
    new PlaceholderExtension({ placeholder }),
    new CountExtension({ maximum: maxChar }),
  ]

  const { manager, state } = useRemirror({
    extensions: useCallback(() => [...extensions], []),
    stringHandler: "html",
    content: content || "",
  })

  const htmlString = (doc: Node | undefined) =>
    doc ? prosemirrorNodeToHtml(doc) : null

  const onChange = (
    params: RemirrorEventListenerProps<Remirror.Extensions>
  ) => {
    if (setContent) {
      setContent(htmlString(params.tr?.doc))
    }
    const current = manager.getExtension(CountExtension).getCharacterCount()
    const isValid = manager.getExtension(CountExtension).isCountValid()
    if (maxChar>0) {
        setCount(() => current)
        setPerc(() => Math.floor((current/maxChar)*100))
    }
    if (setValid) {
        setValid(() => current >= 1 && isValid)
    }
  }

  return (
    <div className="remirror-theme bg-base-200 text-base-content rounded-md">
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={(p) => onChange(p)}
        autoFocus
      >
        <EditorComponent />
      </Remirror>
      {maxChar > 0 && (
        <div className="w-full flex">
            {/* @ts-ignore */}
            <progress className={`w-full -my-1 h-1 ${count >= maxChar ? 'progress-error' : perc > 90 ? 'progress-warning' : 'progress-primary'}`} value={perc} max={100} />
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(InlineTextarea), { ssr: false })
