import { GearIcon, HouseIcon, UserIcon } from "../ui/icons"
import ShrinkableIconLink from "../ui/shrinkableIconLink"
import useCyfrUser from "../../hooks/useCyfrUser"

type NavbarProps = {
  className?: string
  iconClassName?: string
}

const Navbar = ({ className, iconClassName }: NavbarProps) => {
  const {cyfrUser} = useCyfrUser()

  return (
    <>
      <nav
        className={`${className} sticky top-0 bg-secondary flex flex-col z-50`}
      >
        <div
          className={`space-x-6 flex justify-end`}
        >
          <ShrinkableIconLink
            href="/"
            label="Home"
            icon={HouseIcon}
            className={iconClassName}
          />
          {cyfrUser ? ( 
            <ShrinkableIconLink
            href={"/account"}
            // @ts-ignore
            label={cyfrUser.name}
            icon={GearIcon}
            className={iconClassName}
            />
          ) : (
            <ShrinkableIconLink
            href={"/login"}
            label={"Login"}
            icon={UserIcon}
            className={iconClassName}
            />
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
