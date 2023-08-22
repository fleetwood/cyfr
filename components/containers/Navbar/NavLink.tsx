import Link from "next/link"
import {VariantProps} from "types/props"

const NavLink = ({
  page,
  variant = 'primary',
}: {
  page: any
  variant?: VariantProps
}) => (
  <Link
    href={page.url}
    className={`
    text-${variant}-content bg-${variant} font-semibold
    flex space-x-2 py-2 px-4
    transition-all duration-200
  `}
  >
    <span>{page.icon}</span>
    <span>{page.label}</span>
  </Link>
)

export default NavLink