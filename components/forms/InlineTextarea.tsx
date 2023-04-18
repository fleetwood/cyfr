import { CountExtension } from "@remirror/extension-count"
import { Node } from "@remirror/pm/dist-types/model"
import {
  EditorComponent,
  Remirror,
  useRemirror
} from "@remirror/react"
import dynamic from "next/dynamic"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState
} from "react"
import {
  RemirrorEventListenerProps,
  prosemirrorNodeToHtml
} from "remirror"
import {
  BoldExtension,
  ItalicExtension,
  PlaceholderExtension
} from "remirror/extensions"
import useDebug from "../../hooks/useDebug"
import EZButton from "../ui/ezButton"
const {debug, todo} = useDebug("InlineTextArea")

type MentionItem = { id: string, label: string }

type InlineTextareaProps = {
  placeholder?: string
  content?: string | null
  setContent?: (Dispatch<SetStateAction<string | null>>) | ((html?:string | null) => void)
  setValid?: Dispatch<SetStateAction<boolean>>
  setCounter?: Dispatch<SetStateAction<number>>
  onSave?: () => void
  maxChar?: number
}

const InlineTextarea = ({
  placeholder,
  content,
  setContent,
  maxChar = -1,
  setValid,
  onSave
}: InlineTextareaProps) => {
  const [count, setCount] = useState(-1)
  const [perc, setPerc] = useState(0)
  const [showSave, setShowSave] = useState(false)
  const [isValid, setIsValid] = useState(false)

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

  const validate = (b:boolean) => {
    setIsValid(() => b)
    if (setValid) {
      setValid(() => b)
    }
  }

  const htmlString = (doc: Node | undefined) =>
    doc ? prosemirrorNodeToHtml(doc) : null

  const onChange = (params: RemirrorEventListenerProps<Remirror.Extensions>) => {
    const newContent = htmlString(params.tr?.doc)
    const didChange = content && newContent && content?.indexOf(newContent) < 0
    debug('onChange', didChange)
    if (!didChange) {
      return
    }

    if (setContent) {
      setContent(htmlString(params.tr?.doc))
    }
    setShowSave(() => true)
    const current = manager.getExtension(CountExtension).getCharacterCount()
    const isValid = manager.getExtension(CountExtension).isCountValid()
    if (maxChar>0) {
        setCount(() => current)
        setPerc(() => Math.floor((current/maxChar)*100))
    }
    debug('isValid?',{current,isValid})
    validate(current >= 1 && isValid)
  }

  const onClickSave = () => {
    if (onSave) onSave()
    setShowSave(() => false)
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
      {onSave && showSave &&
        <EZButton disabled={!isValid} label="Save" whenClicked={onClickSave} />
      }
    </div>
  )
}

export default dynamic(() => Promise.resolve(InlineTextarea), { ssr: false })
