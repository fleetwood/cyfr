import { CheckmarkIcon } from 'components/ui/icons'
import useDebug from 'hooks/useDebug'
import React, { ReactNode, useEffect, useState } from 'react'
import { TailwindFormProps } from 'types/props'

const { debug } = useDebug('forms/TailwindLabel')

type twLabelProps = {
  label:            string
  labelClassName?:  string
  cardClassName?:   string
  required?:        boolean
  valid?:           boolean
  children:         ReactNode
}

export const IsRequired = ({required, valid}:{required:boolean, valid:boolean}) => {
  return required ? (
    <span className="sups" aria-label="Required">
      {valid ? CheckmarkIcon : '*'}
    </span>
  ) : (
    <span className="sups" aria-label="Optional">
      {valid ? CheckmarkIcon : '?'}
    </span>
  )
}

const TailwindLabel = ({
  label,
  labelClassName,
  cardClassName,
  required = false,
  valid = false,
  children
}: twLabelProps) => {
  const [isValid, setIsValid] = useState(valid)

  useEffect(() => {setIsValid(() => valid)}, [valid])
  
  return (
    <label className={`block ${cardClassName || ''}`}>
      {label && (
        <span className={labelClassName ?? '' + ' text-primary font-bold flex'}>
          {label}
          <IsRequired required={required} valid={isValid} />
        </span>
      )}
      {children}
    </label>
  )
}

export default TailwindLabel
