import React from "react"

type TextAreaProps = {
    label: string,
    placeholder?: string,
    value: string|null, 
    setValue: React.Dispatch<React.SetStateAction<string | null>>
    rows?: 3 | 5 |10,
}

const TailwindTextarea = ({label, value, setValue, placeholder='', rows=3}:TextAreaProps) => {
  return (
    <label className="block">
      <span className="text-base-content">{label}</span>
      <textarea
        className="
          mt-1
          block
          w-full
          rounded-md
          border-none
          shadow-sm
          focus:border-base-content 
          focus:ring 
          focus:ring-accent-focus 
          focus:ring-opacity-50"
        rows={rows}
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value)}
      ></textarea>
    </label>
  )
}

export default TailwindTextarea
