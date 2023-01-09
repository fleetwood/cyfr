import React from "react"

type twInputProps = {
    label: string,
    placeholder?: string,
    type: "text" | "email" | "date" | "checkbox",
    value: string|null, 
    setValue: React.Dispatch<React.SetStateAction<string | null>>
}

const typeClasses = {
    text: `
        mt-1
        block
        w-full
        rounded-md
        border-gray-300
        shadow-sm
        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`,
    email: `
    `,
    date: `
    `,
    checkbox: `
    `
}

const TailwindInput = ({label, type, value, setValue, placeholder=''}:twInputProps) => {
  return (
    <label className="block">
      <span className="text-base-content">{label}</span>
      <input
        type={type}
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
        placeholder={placeholder}
        value={value||''}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}
      />
    </label>
  )
}

export default TailwindInput
