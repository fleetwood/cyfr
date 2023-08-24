import Link, { LinkProps } from "next/link"
import { ReactNode } from "react"

type ShrinkableIconLinkProps = LinkProps & {
  label?: string
  target?: string
  className?: string
  iconClassName?: string
  titleClassName?: string
  linkColor?: string
  dir?: 'right' | 'left' | 'center'
  children?: ReactNode
}

const ShrinkableLink = (props: ShrinkableIconLinkProps) => {
  const {
    href,
    label,
    target,
    className,
    iconClassName,
    titleClassName,
    linkColor,
    dir = 'right',
    children
  } = props
  const t = target || "_self"
  return (
    <Link
      href={href}
      passHref
      target={t}
      className={`
        ${linkColor || "text-secondary-content"}
        text-opacity-70
        hover:text-opacity-100
        hover:shadow
        rounded-3xl p-2
        transition-colors ease-linear duration-200
        flex space-x-1 ${className || ""}
  `}
    >
      <>
        {dir === 'left' && label && (
          <span className={`hidden lg:inline-block ${titleClassName || ""}`}>
            {label}
          </span>
        )}
        {children}
        {dir !== 'left' && label && (
          <span className={`hidden lg:inline-block ${titleClassName || ""}`}>
            {label}
          </span>
        )}
      </>
    </Link>
  )
}

export default ShrinkableLink
