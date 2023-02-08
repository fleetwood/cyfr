import dynamic from "next/dynamic"
import { DeltaStatic, Sources } from "quill"
import { useState } from 'react'
import ReactQuill, { UnprivilegedEditor } from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { log } from "../../utils/log"

const SQuill = dynamic(import('react-quill'), { ssr: false })

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

  const handleChange = (v:string, d:DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    const l = editor.getLength()

    if (setContent) {
        setContent(v)
    }
    // seems to be a hidden character upon initial typing...
    setCharCount(l-1)
    setRemainder(limit - l + 1)
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
  </div>
}
export default SimpleQuill