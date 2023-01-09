import React from "react"
import { TailwindFormProps } from "../../types/props"

type TextAreaProps = TailwindFormProps & {
    rows?: 3 | 5 |10,
}

const TailwindTextarea = ({label, value, setValue, cardClassName, labelClassName, inputClassName, placeholder='', rows=3}:TextAreaProps) => {
  return (
    <label className={`block ${cardClassName}`}>
      <span className={labelClassName}>{label}</span>
      <textarea
        className={`
          mt-1
          block
          w-full
          rounded-md
          border-none
          shadow-sm
          focus:border-base-content 
          focus:ring 
          focus:ring-accent-focus 
          focus:ring-opacity-50
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
