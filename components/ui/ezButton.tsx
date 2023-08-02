import { MouseEventHandler, ReactNode } from "react"
import { VariantProps } from "types/props"

// TODO Add SizeProps, and Rounded props
type EzButtonProps = {
    variant?: VariantProps
    label: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
    className?: string
}

const EZButton = ({label, onClick, className, variant = 'primary', disabled=false}:EzButtonProps) => <button className={`btn btn-${variant} text-${variant}-content ${className}`} onClick={onClick} disabled={disabled}>{label}</button>

export default EZButton