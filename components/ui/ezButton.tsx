import { MouseEventHandler, ReactNode } from "react"

export type EZButtonVariant = "base" | "primary" | "secondary" | "accent" | "success" | "info" | "warning" | undefined

type EzButtonProps = {
    variant?: EZButtonVariant
    label: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
    className?: string
}

const EZButton = ({label, onClick, className, variant = 'primary', disabled=false}:EzButtonProps) => <button className={`btn btn-${variant} text-${variant}-content ${className}`} onClick={onClick} disabled={disabled}>{label}</button>

export default EZButton