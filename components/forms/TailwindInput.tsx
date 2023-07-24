import useDebug from 'hooks/useDebug'
import React from 'react'
import { TailwindFormProps } from 'types/props'
import { debounce } from 'debounce'

const { debug } = useDebug('forms/TailwindInput', 'DEBUG')

type twInputProps = TailwindFormProps & {
  type: 'text' | 'email' | 'date' | 'checkbox'
  required?: boolean
  nullable?: boolean
}

export const IsRequired = (required: { required: boolean }) => {
  return required ? (
    <span className="sups" aria-label="Required">
      *
    </span>
  ) : (
    <span className="sups" aria-label="Optional">
      ?
    </span>
  )
}

const TailwindInput = ({
  label,
  type,
  value,
  setValue,
  nullable,
  cardClassName,
  labelClassName,
  inputClassName,
  placeholder = '',
  required = false,
  error,
  validate
}: twInputProps) => {
  return (
    <label className={`block ${cardClassName || ''}`}>
      {label && (
        <span className={labelClassName ?? '' + ' text-primary font-bold'}>
          {label}
          <IsRequired required={required} />
        </span>
      )}
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
          ${error && 'input-bordered input-error'}
          ${inputClassName}`}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.currentTarget.value)
          validate && debounce(validate,250)
        }}
      />
      {error && <div className="text-sm text-error">{error}</div>}
    </label>
  )
}

export default TailwindInput
