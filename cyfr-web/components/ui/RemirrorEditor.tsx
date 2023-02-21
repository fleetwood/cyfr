import dynamic from "next/dynamic"
import {
  //   BoldExtension,
  //   ItalicExtension,
  EmojiExtension,
  PlaceholderExtension,
} from "remirror/extensions"
import { prosemirrorNodeToHtml, htmlToProsemirrorNode } from "remirror"
import {
  EditorComponent,
  EmojiPopupComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
} from "@remirror/react"
import data from "svgmoji/emoji.json"
import { useCallback } from "react"
// import 'remirror/styles/all.css'

const RemirrorEditor = () => {
  const extensions = useCallback(
    () => [
      new EmojiExtension({ data, moji: "noto" }),
      new PlaceholderExtension({ placeholder: `Type : to insert emojis` }),
    ],
    []
  )
  const { manager, state } = useRemirror({ extensions })

  const htmlString = prosemirrorNodeToHtml(state.doc)

  return (
    <div className="remirror-theme">
      <Remirror manager={manager} initialContent={state} autoFocus>
        <EmojiPopupComponent />
        <EditorComponent />
      </Remirror>
    </div>
  )
}

export default dynamic(() => Promise.resolve(RemirrorEditor), { ssr: false })
