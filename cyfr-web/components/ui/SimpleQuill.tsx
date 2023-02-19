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
  const [remainder, setRemainder] = useState<number>(limit)
  const [charCount, setCharCount] = useState<number>(0)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState<string>('')
  const [mentionIndex, setMentionIndex] = useState<number>(0)

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

  const ignoreKey = (e:KeyboardEvent) => {
    const r = ['Control', 'Delete', 'Shift', `Escape`, `CapsLock`,`Backspace`,`#$%^&*();:"'<>,./?\\`].indexOf(e.key)
    log(`IgnoreKey: ${e.key} : ${r}`)
    return r >= 0
  }
  const cancelKey = (e:KeyboardEvent) => {
    const r = ['Escape'].indexOf(e.key)
    return r >= 0
  }
  const selectKey = (e:KeyboardEvent) => {
    const r = ['Tab', 'Space', 'Enter'].indexOf(e.key)
    return r >= 0
  }
  const alpha = (e:KeyboardEvent) => ignoreKey(e) !== false && RegExp(`^[A-Za-z0-9_@.+-]*$`).test(e.code) === true

  const handleKey = (e:KeyboardEvent) => {
    const closeSearch = () => {
      setShowMentions(() => false)
      setMentionSearch((s) => '')
    }

    if(e.key==='@') {
      log(`Squill.handleKey @`)
      setShowMentions(() => true)
    } else if (!showMentions) {
      return
    }

    e.preventDefault()

    if (ignoreKey(e)) {
      log(`ignoring ${e.key}`)
    }
    else if(cancelKey(e)) {
      log(`Squill.cancelKey`)
      e.preventDefault()
      closeSearch()
    }
    else if (selectKey(e)) {
      log(`Squill.acceptKey`)
      closeSearch()
    }
    else if(e.key==='ArrowDown') {
      log(`Squill.handleKey ArrowDown`)
      setMentionIndex((i) => i+1)
    }
    else if(e.key==='ArrowUp') {
      log(`Squill.handleKey ArrowUp`)
      setMentionIndex((i) => i <= 0 ? 0 : i-1)
    }
    else if(e.key==='Backspace') {
      log(`Squill.handleKey Backspace`)
      setMentionSearch((s) => s.length > 0 ? s.substring(0,s.length-1) : '')
      if (mentionSearch.length<1) {
        closeSearch()
      }
    }
    else if (showMentions) {
      log(`sending to mentions ${e.key}`)
      setMentionSearch((s) => s+e.key)
    }
  }

  const addEmoji = (emoji:EmojiChar) => {
    const c= content || ''
    const at = content ? content.indexOf(`<br></p>`)===content.length-8 ? content.length-8 : content.length -4 : 0
    setContent(() => `${c.substring(0,at)}${emoji.char}${c.substring(at)}`)
  }

  const addMention = (mention:string) => {
    const c= content || ''
    const at = content ? content.indexOf(`<br></p>`)===content.length-8 ? content.length-8 : content.length -4 : 0
    const update = `${c.substring(0,at)}${mention}${c.substring(at)}`
    log(`addMention ${update}`)
    // <span class="mention-link" userName="J Fleetwood" userId="clduqlb6g0002jpbih8eoiy1u">@J Fleetwood</span>
    setContent(() => update)
  }

  const handleSelection = (selection: ReactQuill.Range, source: Sources, editor: UnprivilegedEditor) => {
    // log('onChangeSelection', selection)
  }

  const [cyfrUser] = useCyfrUser()

  return <div>
    <SQuill 
      className="bg-base-300 text-base-content" theme="snow" 
      modules={modules} formats={formats} 
      value={content!} onChange={() =>handleChange} 
      onKeyUp={handleKey}
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
        <MentionsMenu 
          onSelect={addMention} 
          showMenu={showMentions} 
          setShowMenu={setShowMentions} 
          searchTerm={mentionSearch} 
          index={mentionIndex}
          setIndex={setMentionIndex}
          />
      </div>
      
  </div>
}
export default SimpleQuill