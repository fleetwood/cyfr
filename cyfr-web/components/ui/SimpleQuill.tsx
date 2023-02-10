import dynamic from "next/dynamic"
import { DeltaStatic, Sources } from "quill"
import { Dispatch, SetStateAction, useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { EmojiChar } from "../../prisma/types/emoji.def"
import { log } from "../../utils/log"
import EmojiMenu from "./EmojiMenu"

const SQuill = dynamic(import('react-quill'), { ssr: false })

type SimpleQuillProps = {
    content?: string|null
    setContent: Function
    limit?: number
}

const SimpleQuill = ({content, setContent, limit = 256}:SimpleQuillProps) => {
  const modules = {toolbar: null}
  const formats = ['header','bold', 'italic', 'strike', 'blockquote','list', 'bullet', 'indent','link']
  const [remainder, setRemainder] = useState<number>(limit)
  const [charCount, setCharCount] = useState<number>(0)
  const [showEmojiMenu, setShowEmojiMenu] = useState(true)

  const handleChange = (v:string, d:DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    const insert = d.ops? d.ops[d.ops.length-1].insert : undefined;
    if (insert) {
      const i = insert
      if (i===":") {
        setShowEmojiMenu(() => true)
      } else if (i == ' ') {
        setShowEmojiMenu(() => false)
      }
    }
    
    const l = editor.getLength()

    if (setContent) {
        setContent(() => v)
    }
    // seems to be a hidden character upon initial typing...
    setCharCount(l-1)
    setRemainder(limit - l + 1)
  }

  const addEmoji = (emoji:EmojiChar) => {
    const c= content || ''
    const at = content ? content.indexOf(`<br></p>`)===content.length-8 ? content.length-8 : content.length -4 : 0
    setContent(() => `${c.substring(0,at)}${emoji.char}${c.substring(at)}`)
  }

  const handleSelection = (selection: ReactQuill.Range, source: Sources, editor: UnprivilegedEditor) => {
    // log('onChangeSelection', selection)
  }

  return <div>
    <SQuill 
      className="bg-base-300 text-base-content" theme="snow" 
      modules={modules} formats={formats} 
      value={content!} onChange={handleChange} 
      onChangeSelection={handleSelection}
      />
      {limit > 0 &&
        <div className={`flex justify-between ${charCount/limit>0.9?'text-warning':''}`}>
          <span>{charCount}</span>
          <span>{remainder}</span>
        </div>
      }
      <EmojiMenu onSelect={addEmoji} />
  </div>
}
export default SimpleQuill