import React from "react"
import { TailwindFormProps } from "../../types/props"

type twInputProps = TailwindFormProps & {
  type: "text" | "email" | "date" | "checkbox"
  required?: boolean
}

const TailwindInput = ({label, type, value, setValue, cardClassName, labelClassName, inputClassName, placeholder='', required=false}:twInputProps) => {
  const IsRequired = () => {
    return required 
    ? (<span className='sups' aria-label='Required'>*</span>) 
    : (<span className='sups' aria-label='Optional'>?</span>)
  }

  return (
    <label className={`block ${cardClassName||''}`}>
      {label &&
        <span className={labelClassName+' text-primary font-bold'}>{label}<IsRequired /></span>
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
          focus:border-2
          focus:border-primary
          focus:border-opacity-20
          ${inputClassName}`}
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
      />
    </label>
  )
}

export default TailwindInput
