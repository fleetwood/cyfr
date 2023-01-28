import { Dispatch, SetStateAction } from "react"

export type classNameProps = {
  className?: string
}

export type KeyVal = {
  key: string
  value?: string | number | null
}

export type TailwindFormProps = {
  label: string
  placeholder?: string
  value: string | null
  setValue: Dispatch<SetStateAction<string | null>>
  cardClassName?: string
  labelClassName?: string
  inputClassName?: string
}
