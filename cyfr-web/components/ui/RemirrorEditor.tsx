import dynamic from "next/dynamic"
import {
    BoldExtension,
    ItalicExtension,
    MentionAtomExtension,
  EmojiExtension,
  PlaceholderExtension,
  MentionAtomNodeAttributes,
} from "remirror/extensions"
import { prosemirrorNodeToHtml, htmlToProsemirrorNode, RemirrorEventListener, RemirrorEventListenerProps } from "remirror"
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
import { Node } from "@remirror/pm/dist-types/model"

type MentionItem = {id: string, label: string}

type RemirrorEditorProps = {
    placeholder?: string,
    content?: string|null, 
    setContent?: Dispatch<SetStateAction<string|null>>
}

const RemirrorEditor = ({placeholder, content, setContent}:RemirrorEditorProps) => {
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
  const { manager, state } = useRemirror({ extensions, stringHandler: 'html', content: content || '' })

  const htmlString = (doc:Node|undefined) => doc ? prosemirrorNodeToHtml(doc) : null

  const {getMentions} = useCyfrUserApi()

  const mentionSelect = (e:MentionAtomState<MentionAtomNodeAttributes> | null) => {
    if (e) {
        setSearch(() => e.query.full)
    } else {
        setSearch('')
    }
  }

  const onChange = (params:RemirrorEventListenerProps<Remirror.Extensions>) => {
    // log(`RemirrorEditor.onchange ${JSON.stringify({content: params.tr?.doc.content, html: htmlString(params.tr?.doc)}, null, 1)}`)
    if (setContent) {
        setContent(htmlString(params.tr?.doc))
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
      <Remirror manager={manager} initialContent={state} onChange={(p) => onChange(p)} autoFocus>
        <EmojiPopupComponent />
        <MentionAtomPopupComponent items={mentions} onChange={mentionSelect} />
        <EditorComponent />
      </Remirror>
    </div>
  )
}

export default dynamic(() => Promise.resolve(RemirrorEditor), { ssr: false })
