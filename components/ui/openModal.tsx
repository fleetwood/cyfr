import React from 'react'

type OpenModalVariant = 'button'|'plus'

export type OpenModalProps = {
    variant?:   OpenModalVariant
    label?:     string
    htmlFor:    string
}

const OpenModal = ({label, htmlFor, variant='button'}:OpenModalProps) => (
    variant === 'button' 
    ?
      <label htmlFor={htmlFor} className="btn btn-info space-x-2">
        <span className="text-info-content">{label??'Open Modal'}</span>
      </label>
    :
      <label htmlFor={htmlFor} className="btn btn-sm btn-info btn-circle">+</label>
  )

export default OpenModal