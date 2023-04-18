
type ShrinkableIconLabelProps = {
  icon?: JSX.Element
  label?: string
  className?: string
  iconClassName?: string
  labelClassName?: string
  linkColor?: string
  dir?: 'right' | 'left' | 'center'
  onClick?: Function
}

const ShrinkableIconLabel = ({
  icon,
  label,
  className,
  iconClassName,
  labelClassName,
  linkColor,
  onClick,
  dir = 'right'
}: ShrinkableIconLabelProps) => {
  const onLabelClick = (e:any) => {
    if (onClick) {
      onClick(e)
    }
  }
  return (
    <label
      className={`
        ${linkColor || "text-secondary-content"}
        flex space-x-1 ${className || ""}
      `}
      >
        {dir === 'left' && label && (
          <span className={`hidden lg:inline-block ${labelClassName || ""}`}>
            {label}
          </span>
        )}
        <span className={`
          ${iconClassName}
          ${onClick !== null ? `cursor-pointer hover:text-secondary` : ` `}
          transition-colors ease-linear duration-200
          `}
          onClick={onLabelClick}>
            {icon}
          </span>
        {dir !== 'left' && label && (
          <span className={`hidden lg:inline-block ${labelClassName || ""}`}>
            {label}
          </span>
        )}
    </label>
  )
}

export default ShrinkableIconLabel
