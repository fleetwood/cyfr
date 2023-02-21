import dynamic from "next/dynamic"
import {
    BoldExtension,
    ItalicExtension,
    MentionAtomExtension,
  EmojiExtension,
  PlaceholderExtension,
  MentionAtomNodeAttributes,
} from "remirror/extensions"
import { prosemirrorNodeToHtml, htmlToProsemirrorNode } from "remirror"
import {
  EditorComponent,
  EmojiPopupComponent,
  MentionAtomPopupComponent,
  MentionAtomState,
  Remirror,
  useRemirror,
} from "@remirror/react"
import data from "svgmoji/emoji.json"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { useCyfrUserApi } from "../../hooks/useCyfrUser"
import { log } from "../../utils/log"

type MentionItem = {id: string, label: string}

type RemirrorEditorProps = {
    placeholder?: string,
    value?: string|null, 
    setValue?: Dispatch<SetStateAction<string|null>>
}

const RemirrorEditor = ({placeholder, value, setValue}:RemirrorEditorProps) => {
const [mentions, setMentions] = useState<MentionItem[]>([])
const [search, setSearch] = useState('')
  const extensions = useCallback(
    () => [
        new BoldExtension(),
        new ItalicExtension(),
        new MentionAtomExtension({
            extraAttributes: {type: 'user'},
            matchers: [{name: 'at', char: '@', matchOffset: 0, mentionClassName: 'user-mention'}]
        }),
      new EmojiExtension({ data, moji: "noto" }),
      new PlaceholderExtension({ placeholder }),
    ],
    []
  )
  const { manager, state } = useRemirror({ extensions })

  const htmlString = prosemirrorNodeToHtml(state.doc)

  const {getMentions} = useCyfrUserApi()

  const mentionSelect = (e:MentionAtomState<MentionAtomNodeAttributes> | null) => {
    if (e) {
        setSearch(() => e.query.full)
    } else {
        setSearch('')
    }
  }

  const get = () => {
    getMentions(search)
        .then((results) => {
            if (!results.result) {
                setMentions(() => [])
            }
            const mentions = results.result.map((m) => {return{id: m.id,label: m.name}}) as unknown as MentionItem[]
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
    <div className="remirror-theme">
      <Remirror manager={manager} initialContent={state} autoFocus>
        <EmojiPopupComponent />
        <MentionAtomPopupComponent items={mentions} onChange={mentionSelect} />
        <EditorComponent />
      </Remirror>
    </div>
  )
}

export default dynamic(() => Promise.resolve(RemirrorEditor), { ssr: false })
