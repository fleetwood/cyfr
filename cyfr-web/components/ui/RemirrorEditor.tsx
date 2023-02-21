import dynamic from "next/dynamic"
import {
  BoldExtension,
  ItalicExtension,
  MentionAtomExtension,
  EmojiExtension,
  PlaceholderExtension,
  MentionAtomNodeAttributes,
} from "remirror/extensions"
import { CountExtension } from "@remirror/extension-count"
import {
  prosemirrorNodeToHtml,
  htmlToProsemirrorNode,
  RemirrorEventListener,
  RemirrorEventListenerProps,
} from "remirror"
import {
  EditorComponent,
  EmojiPopupComponent,
  MentionAtomPopupComponent,
  MentionAtomState,
  Remirror,
  useRemirror,
} from "@remirror/react"
import data from "svgmoji/emoji.json"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useCyfrUserApi } from "../../hooks/useCyfrUser"
import { log } from "../../utils/log"
import { Node } from "@remirror/pm/dist-types/model"

type MentionItem = { id: string, label: string }

type RemirrorEditorProps = {
  placeholder?: string
  content?: string | null
  setContent?: Dispatch<SetStateAction<string | null>>
  setValid?: Dispatch<SetStateAction<boolean>>
  maxChar?: number
}

const RemirrorEditor = ({
  placeholder,
  content,
  setContent,
  maxChar = -1,
  setValid
}: RemirrorEditorProps) => {
  const { getMentions } = useCyfrUserApi()
  const [mentions, setMentions] = useState<MentionItem[]>([])
  const [search, setSearch] = useState("")
  const [count, setCount] = useState(-1)
  const [perc, setPerc] = useState(0)

  let extensions = [
    new BoldExtension(),
    new ItalicExtension(),
    new EmojiExtension({ data }),
    new PlaceholderExtension({ placeholder }),
    new MentionAtomExtension({
      extraAttributes: { type: "user" },
      matchers: [
        {
          name: "at",
          char: "@",
          matchOffset: 0,
          mentionClassName: "user-mention",
        },
      ],
    }),
    new CountExtension({ maximum: maxChar }),
  ]

  const { manager, state } = useRemirror({
    extensions: useCallback(() => [...extensions], []),
    stringHandler: "html",
    content: content || "",
  })

  const htmlString = (doc: Node | undefined) =>
    doc ? prosemirrorNodeToHtml(doc) : null

  const mentionSelect = (
    e: MentionAtomState<MentionAtomNodeAttributes> | null
  ) => setSearch(() => (e ? e.query.full : ""))

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

  const get = () => {
    getMentions(search).then((results) => {
      if (!results.result) {
        setMentions(() => [])
      }
      const mentions = results.result.map((m) => {
        return { id: m.id, label: m.name }
      }) as unknown as MentionItem[]
      setMentions(mentions)
    })
  }

  useEffect(() => {
    get()
  }, [])
  useEffect(() => {
    get()
  }, [search])

  return (
    <div className="remirror-theme bg-base-200 text-base-content rounded-md">
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={(p) => onChange(p)}
        autoFocus
      >
        <EmojiPopupComponent />
        <MentionAtomPopupComponent items={mentions} onChange={mentionSelect} />
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

export default dynamic(() => Promise.resolve(RemirrorEditor), { ssr: false })
