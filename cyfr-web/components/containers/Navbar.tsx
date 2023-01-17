import { GearIcon, HouseIcon, UserIcon } from "../ui/icons";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import {
  useCyfrUserContext,
} from "../context/CyfrUserProvider";
import { useContext } from "react";
import { ToastContext } from "../context/ToastContextProvider";
import Avatar from "../ui/avatar";

type NavbarProps = {
  className?: string;
  iconClassName?: string;
};

const Navbar = ({ className, iconClassName }: NavbarProps) => {
  const { cyfrUser } = useCyfrUserContext();

  return (
    <>
      <nav
        className={`
          ${className} 
          sticky top-0 
          bg-secondary 
          flex flex-col 
          z-40`}
      >
        <div className={`space-x-6 flex justify-end`}>
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
              icon={<Avatar user={cyfrUser} sz="wee" />}
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
