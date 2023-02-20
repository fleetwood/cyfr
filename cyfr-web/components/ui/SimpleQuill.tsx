import dynamic from "next/dynamic"
import { DeltaStatic, Sources } from "quill"
import { Dispatch, SetStateAction, useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import useCyfrUser, { getCyfrUser } from "../../hooks/useCyfrUser"
import { User } from "../../prisma/prismaContext"
import { EmojiChar } from "../../prisma/types/emoji.def"
import { getApi } from "../../utils/api"
import { log } from "../../utils/log"
import Mention from './mention'
import EmojiMenu from "./EmojiMenu"
import MentionsMenu from "./MentionsMenu"
import { match } from "assert"

const SQuill = dynamic(import('react-quill'), { ssr: false })


type SimpleQuillProps = {
    content?: string|null
    setContent: Function
    limit?: number
}

const SimpleQuill = ({content, setContent, limit = 256}:SimpleQuillProps) => {

  const modules = {toolbar: null,}
  const formats = ['header','bold', 'italic', 'strike', 'blockquote','list', 'bullet', 'indent','link']
  const [charCount, setCharCount] = useState<number>(0)

  const handleChange = (v:string, d:DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    const insert = d.ops? d.ops[d.ops.length-1].insert : undefined;
    const l = editor.getText().trim().length

    if (setContent) {
        setContent(() => v)
    }
    // seems to be a hidden character upon initial typing...
   setCharCount(l)
  }

  const handleSelection = (selection: ReactQuill.Range, source: Sources, editor: UnprivilegedEditor) => {
    // log('onChangeSelection', selection)
  }

  const [cyfrUser] = useCyfrUser()

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
          <span>{limit-charCount}</span>
        </div>
      }
      
  </div>
}
export default SimpleQuill