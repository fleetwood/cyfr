import React from "react"
import { TailwindFormProps } from "../../types/props"

type twInputProps = TailwindFormProps & {
  type: "text" | "email" | "date" | "checkbox";
}

const TailwindInput = ({label, type, value, setValue, cardClassName, labelClassName, inputClassName, placeholder=''}:twInputProps) => {
  return (
    <label className={`block ${cardClassName||''}`}>
      {label &&
        <span className={labelClassName+' text-primary font-bold'}>{label}</span>
      }
      <input
        type={type}
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
          focus:border-base-content 
          focus:ring 
          focus:ring-accent-focus 
          focus:ring-opacity-50
          ${inputClassName}`}
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
      />
    </label>
  )
}

export default TailwindInput
