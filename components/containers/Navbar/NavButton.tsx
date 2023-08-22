import {MuiArrowLeftIcon} from "components/ui/icons"
import {NavPage, VariantProps} from "types/props"

const NavButton = ({
  page,
  variant = 'primary',
  selected
}: {
  page: NavPage,
  selected?: boolean
  variant?: VariantProps
}) => {
  const style = selected
    ? `
    text-${variant}-content 
    hover:text-${variant}-accent 
    hover:bg-${variant}-focus`
    : `
    text-${variant}-accent 
    hover:text-${variant}-focus 
    hover:bg-${variant}-content`

  return (
    <a
      href={page.url}
      className={`${style} 
      text-opacity-80 font-semibold
      hover:text-opacity-100 
      flex space-x-2 py-2 px-4
      transition-all duration-200
    `}
    >
      <span>
        {selected && <MuiArrowLeftIcon className="rotate-180" />}
        {page.icon}
      </span>
      <span>{page.label}</span>
    </a>
  )}

export default NavButton