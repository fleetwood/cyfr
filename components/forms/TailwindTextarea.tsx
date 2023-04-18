import React from "react"
import { TailwindFormProps } from "../../types/props"

type TextAreaProps = TailwindFormProps & {
    rows?: 3 | 5 |10,
    required?: boolean
}

const TailwindTextarea = ({label, value, setValue, cardClassName, labelClassName, inputClassName, placeholder='', rows=3, required=false}:TextAreaProps) => {
  const IsRequired = () => {
    return required 
    ? (<span className='sups' aria-label='Required'>*</span>) 
    : (<span className='sups' aria-label='Optional'>?</span>)
  }
  return (
    <label className={`block ${cardClassName}`}>
      <span className={labelClassName+' text-primary font-bold'}>{label}<IsRequired /></span>
      <textarea
        className={`
          mt-1
          block
          w-full
          rounded-md
          shadow-sm
          font-ibarra
          border-none
          bg-base-200
          text-base-content
          focus:border-2
          focus:border-primary
          focus:border-opacity-20
          ${inputClassName}`}
        rows={rows}
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value)}
      ></textarea>
    </label>
  )
}

export default TailwindTextarea
