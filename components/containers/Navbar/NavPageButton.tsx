import Link from "next/link"
import {VariantProps} from "types/props"

const NavPageButton = ({page,variant,}: {page: any, variant: VariantProps}) => (
  <Link
    href={page.url}
    className={`
    text-${variant} font-semibold 
    hover:text-base-100 hover:bg-${variant} 
    flex space-x-2 py-2 px-4
    transition-all duration-200
  `}
  >
    <span>{page.icon}</span>
    <span>{page.label}</span>
  </Link>
)

export default NavPageButton