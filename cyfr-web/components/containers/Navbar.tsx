import { useEffect, useState } from "react";
import {
  useCyfrUserContext
} from "../context/CyfrUserProvider";
import Avatar from "../ui/avatar";
import { CyfrLogo, HouseIcon, UserIcon } from "../ui/icons";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import ShrinkableLink from "../ui/shrinkableLink";

type NavbarProps = {
  className?: string
  iconClassName?: string
  active: boolean
};

const Navbar = ({ className, iconClassName, active }: NavbarProps) => {
  const { cyfrUser } = useCyfrUserContext()
  const [navActive, setNavActive] = useState(false);

  useEffect(() => {
    setNavActive(active)
  }, [active])

  return (
    <>
      <nav
        className={`
          ${className} 
          sticky top-0 
          bg-secondary 
          flex 
          z-40
          ${navActive ? 'shadow-lg shadow-black' : ''}
          `}
      >
        <div className="flex justify-start">
          <ShrinkableLink
            href="/"
            label="Cyfr"
            className={`ml-1 text-primary transition-all duration-200 ease-linear ${active ? 'mt-0' : '-mt-20'}`}
            >
            <CyfrLogo size="sm" className="text-primary" />
          </ShrinkableLink>
        </div>
        <div className={`space-x-6 flex w-full justify-end`}>
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
              icon={<Avatar user={cyfrUser} sz="wee" link={false} />}
              className={iconClassName}
              dir='left'
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
  );
};

export default Navbar;
