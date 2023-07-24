import React, { ReactNode } from 'react'

type OpenModalVariant = 'button'|'component'|'plus'
export type OpenModalProps = {
    variant?:   OpenModalVariant
    children?:  ReactNode
    label?:     string
    className?: string
    id:         string
}

/**
 * When using `variant` of `component`, {@prop children} is required.
 */
export const ModalOpenButton = ({children,id,className,label,variant}:OpenModalProps) => (
    variant === 'button' 
    ?
      <label htmlFor={id} className="btn btn-info space-x-2">
        <span className="text-info-content">{label??'Open Modal'}</span>
      </label>
    : variant === 'component'
    ? 
        <label htmlFor={id} className={className}>
            {children}
        </label>
    :
      <label htmlFor={id} className="btn btn-sm btn-info btn-circle">+</label>
)

export const ModalCloseButton = ({id}:{id:string}) => <label htmlFor={id} className="btn btn-sm btn-circle btn-warning absolute right-0 top-6">✕</label>

const ModalCheckbox = ({modal,id}:{modal?:React.LegacyRef<HTMLInputElement>|undefined,id:string}) => {

  const toggleModal = (show?:boolean) => {
    if (!modal) return
    const createModal = document.getElementById(id!)
    // @ts-ignore
    createModal!.checked = show || false
  }

  return <input type="checkbox" ref={modal} id={id} className="modal-toggle" onChange={()=>{}} />
}

export default ModalCheckbox