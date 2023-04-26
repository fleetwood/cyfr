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
import { InlineTextareaProps } from "../../types/props"
const {debug, todo} = useDebug("InlineTextArea")

const InlineTextarea = ({
  placeholder,
  content,
  setContent,
  setValid,
  onSave,
  onChange,
  words,
  setWords,
  maxChar = -1,
  showCount = false
}: InlineTextareaProps) => {
  const [chars, setChars] = useState(-1)
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

  const onContentChange = (params: RemirrorEventListenerProps<Remirror.Extensions>) => {
    const newContent = htmlString(params.tr?.doc)
    const didChange = (content||'').indexOf(newContent||'') < 0
    debug('onChange', {content, newContent, index:(content||'').indexOf(newContent||'') < 0, didChange})
    if (!didChange) {
      return
    }

    const charCount = manager.getExtension(CountExtension).getCharacterCount()
    const wordCount = manager.getExtension(CountExtension).getWordCount()
    const isValid = manager.getExtension(CountExtension).isCountValid()
    
    if (maxChar>0) {
      setChars(() => charCount)
      setPerc(() => Math.floor((charCount/maxChar)*100))
    }

    if (setContent) {
      debug('setContent')
      setContent(newContent!)
    }
    if (setWords){
      debug('setWords')
      setWords(wordCount)
    }
    setShowSave(true)
    
    debug('isValid?',{current: charCount,isValid})
    validate(charCount >= 1 && isValid)
  }

  const onClickSave = () => {
    if (onSave) onSave()
    setShowSave(() => false)
  }

  return (
    <div className="remirror-theme max-h-screen text-base-content">
      {words && 
        <div className="text-sm right-0">Words: {words}</div>
      }
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={(p) => onContentChange(p)}
        autoFocus
      >
        <EditorComponent />
      </Remirror>
      {maxChar > 0 && (
        <div className="w-full flex">
            {/* @ts-ignore */}
            <progress className={`w-full -my-1 h-1 ${chars >= maxChar ? 'progress-error' : perc > 90 ? 'progress-warning' : 'progress-primary'}`} value={perc} max={100} />
        </div>
      )}
      {onSave && showSave &&
        <EZButton disabled={!isValid} label="Save" onClick={onClickSave} />
      }
    </div>
  )
}

export default dynamic(() => Promise.resolve(InlineTextarea), { ssr: false })
