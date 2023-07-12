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
import useDebug from "hooks/useDebug"
import dynamic from "next/dynamic"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import UserApi from "prisma/hooks/userApi"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import {
  RemirrorEventListenerProps,
  prosemirrorNodeToHtml
} from "remirror"
import {
  BoldExtension, EmojiExtension, ItalicExtension,
  MentionAtomExtension, MentionAtomNodeAttributes, PlaceholderExtension
} from "remirror/extensions"
import data from "svgmoji/emoji.json"

const {debug} = useDebug("SocialTextArea")

type MentionItem = { id: string, label: string }

type SocialTextareaProps = {
  placeholder?: string
  content?: string | null
  setContent?: Dispatch<SetStateAction<string | null>>
  setValid?: Dispatch<SetStateAction<boolean>>
  setCounter?: Dispatch<SetStateAction<number>>
  maxChar?: number
}

const SocialTextarea = ({
  placeholder,
  content,
  setContent,
  maxChar = -1,
  setValid,
}: SocialTextareaProps) => {
  const  {cyfrUser } = useCyfrUserApi()
  const {mentions} = UserApi()
  const [mentionList, setMentionList] = useState<MentionItem[]>([])
  const [search, setSearch] = useState<string>()
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

  const get = async () => {
    const list = await mentions(search)
    if (list) {
      debug('get', list)
      // setMentionList((m) => (list ?? [])
      //   .map(m => {return {id: m.id, label: m.name}}
      // ))
    }
    return;
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
        <MentionAtomPopupComponent items={mentionList} onChange={mentionSelect} />
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

export default dynamic(() => Promise.resolve(SocialTextarea), { ssr: false })
