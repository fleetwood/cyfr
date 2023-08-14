import { Dispatch, ReactNode, SetStateAction } from "react"

export type classNameProps = {
  className?: string
}

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}

type ColorVariants = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success'
export const memberBorder = (type:string|null|undefined, defaultTo?:ColorVariants) => `border-${type ? `[${stringToColour(type)}]`:defaultTo??'primary'}`
export const memberBg = (type:string|null|undefined, defaultTo?:ColorVariants) => `bg-${type ? `[${stringToColour(type)}]`:defaultTo??'primary'}`
export const memberText = (type:string|null|undefined, defaultTo?:ColorVariants) => `text-${type ? `[${stringToColour(type)}]`:defaultTo??'primary'}`

export type SizeProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const wh = (sz:SizeProps) => sz === 'xs' ? 24 :
           sz === 'sm' ? 36 :
           sz === 'lg' ? 60 :
           sz === 'xl' ? 72 :
           48 // sz === md
           
export type KeyVal = {
  key:          string
  value?:       string | number | null
  description?: ReactNode
}

export type RocketQuery<T> = {
  data:         T
  isLoading:    boolean
  invalidate:   () => void
  error:        any
}

export type TailwindFormProps = {
  label?: string
  placeholder?: string
  value: string | null
  setValue: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<string|null>>
  cardClassName?: string
  labelClassName?: string
  inputClassName?: string
  validate?: () => void
  error?:    string
}

export type InlineTextareaProps = {
  label?:           string
  labelClassName?:  string
  required?:        boolean
  placeholder?:     string
  content?:         string | null | undefined
  setContent?:      (Dispatch<SetStateAction<string>>) | ((content:string) => void)
  words?:           number
  setWords?:        (Dispatch<SetStateAction<number>>) | ((words:number) => void)
  setValid?:        Dispatch<SetStateAction<boolean>>
  setCounter?:      Dispatch<SetStateAction<number>>
  onSave?:          () => void
  onChange?:        (props:InlineTextAreaUpdate) => void
  maxChar?:         number
  showCount?:       boolean
}

export type InlineTextAreaUpdate = {
  content?:   string | null | undefined
  chars:  number
  words:  number
}

export type VariantProps = "base" | "primary" | "secondary" | "accent" | "success" | "info" | "warning" | undefined