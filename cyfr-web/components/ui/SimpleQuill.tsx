import dynamic from "next/dynamic"
import { DeltaStatic, Sources } from "quill"
import { useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation
} from "emoji-picker-react"
import { log } from "../../utils/log"

const SQuill = dynamic(import('react-quill'), { ssr: false })
const EmojiMenu = dynamic(import('emoji-picker-react'), { ssr: false })

type SimpleQuillProps = {
    content?: string|null|undefined
    setContent: (t:string|null) => void
    limit?: number
}

const SimpleQuill = ({content, setContent, limit = 256}:SimpleQuillProps) => {
  const modules = {toolbar: null}
  const formats = ['header','bold', 'italic', 'strike', 'blockquote','list', 'bullet', 'indent','link']
  const [remainder, setRemainder] = useState<number>(limit)
  const [charCount, setCharCount] = useState<number>(0)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("")
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
        setContent(v)
    }
    // seems to be a hidden character upon initial typing...
    setCharCount(l-1)
    setRemainder(limit - l + 1)
  }

  const onEmojiClick = (em: EmojiClickData, ev: MouseEvent) => {
    const emoji = `<Emoji unified={${em.unified}} emojiStyle={EmojiStyle.APPLE} size={22} />`
    log(`onEmojiClick`, emoji)
    return emoji
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
      <div className={showEmojiMenu ? 'inline-block absolute shadow-2xl shadow-black rounded-xl overflow-clip border-2 border-primary' : 'hidden'}>
      <EmojiMenu
        onEmojiClick={onEmojiClick}
        autoFocusSearch={false}
        // theme={Theme.AUTO}
        // searchDisabled
        // skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
        // height={350}
        // width="50%"
        // emojiVersion="0.6"
        // lazyLoadEmojis={true}
        // previewConfig={{
        //   defaultCaption: "Pick one!",
        //   defaultEmoji: "1f92a" // 🤪
        // }}
        // suggestedEmojisMode={SuggestionMode.RECENT}
        // skinTonesDisabled
        // searchPlaceHolder="Filter"
        // defaultSkinTone={SkinTones.MEDIUM}
        // emojiStyle={EmojiStyle.NATIVE}
        // categories={[
        //   {
        //     name: "Fun and Games",
        //     category: Categories.ACTIVITIES
        //   },
        //   {
        //     name: "Smiles & Emotions",
        //     category: Categories.SMILEYS_PEOPLE
        //   },
        //   {
        //     name: "Flags",
        //     category: Categories.FLAGS
        //   },
        //   {
        //     name: "Yum Yum",
        //     category: Categories.FOOD_DRINK
        //   }
        // ]}
      />
      </div>
  </div>
}
export default SimpleQuill