type EzButtonProps = {
    variant?: 'primary'|'secondary'|'accent'|'base'|'success'|'info'|'warning'
    label: string
    whenClicked: Function
    disabled?: boolean
    className?: string
}

const EZButton = ({label, whenClicked, className, variant = 'primary', disabled=false}:EzButtonProps) => <button className={`btn btn-${variant} text-${variant}-content ${className}`} onClick={() => whenClicked()} disabled={disabled}>{label}</button>

export default EZButton