type EzButtonProps = {
    variant?: 'primary'|'secondary'|'accent'|'base'|'success'|'info'|'warning'
    label: string
    whenClicked: Function
    disabled?: boolean
}

const EZButton = ({label, whenClicked, variant = 'primary', disabled=false}:EzButtonProps) => <button className={`btn btn-${variant} text-${variant}-content`} onClick={() => whenClicked()} disabled={disabled}>{label}</button>

export default EZButton