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

const SQuill = dynamic(import('react-quill'), { ssr: false })

type SimpleQuillProps = {
    content?: string|null
    setContent: Function
    limit?: number
}

const SimpleQuill = ({content, setContent, limit = 256}:SimpleQuillProps) => {
  const findMentionables = async (searchTerm:string) => {
    const users:User[] = await getApi('user/mentions')
    log(`findMentionables ${JSON.stringify({searchTerm,users}, null, 2)}`)
    
    return users.filter(person => person.name?.includes(searchTerm))
  }

  const modules = {toolbar: null,}
  const formats = ['header','bold', 'italic', 'strike', 'blockquote','list', 'bullet', 'indent','link']
  const [remainder, setRemainder] = useState<number>(limit)
  const [charCount, setCharCount] = useState<number>(0)
  const [showMentions, setShowMentions] = useState(true)

  const handleChange = (v:string, d:DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    const insert = d.ops? d.ops[d.ops.length-1].insert : undefined;
    if (insert) {
      const i = insert
      if (i=="@") {
        setShowMentions(() => true)
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

  const addMention = (mention:string) => {
    const c= content || ''
    const at = content ? content.indexOf(`<br></p>`)===content.length-8 ? content.length-8 : content.length -4 : 0
    // <span class="mention-link" userName="J Fleetwood" userId="clduqlb6g0002jpbih8eoiy1u">@J Fleetwood</span>
    setContent(() => `${c.substring(0,at)}${mention}${c.substring(at)}`)
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
          <span>{remainder}</span>
        </div>
      }
      <div className="flex justify-end">
        <EmojiMenu onSelect={addEmoji} />
        <MentionsMenu onSelect={addMention} searchTerm='Pan' />
      </div>
      
  </div>
}
export default SimpleQuill