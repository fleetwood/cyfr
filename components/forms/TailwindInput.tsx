import React from "react"
import { TailwindFormProps } from "../../types/props"

type twInputProps = TailwindFormProps & {
  type: "text" | "email" | "date" | "checkbox";
}

const TailwindInput = ({label, type, value, setValue, cardClassName, labelClassName, inputClassName, placeholder=''}:twInputProps) => {
  return (
    <label className={`block ${cardClassName}`}>
      {label &&
        <span className={labelClassName}>{label}</span>
      }
      <input
        type={type}
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
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
      />
    </label>
  )
}

export default TailwindInput
