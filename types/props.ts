import { Dispatch, SetStateAction } from "react"

export type classNameProps = {
  className?: string
}

export type KeyVal = {
  key: string
  value?: string | number | null
}

export type RocketQuery = {
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
