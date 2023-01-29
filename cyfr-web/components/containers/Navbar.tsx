import { useEffect, useState } from "react";
import useCyfrUser from "../../hooks/useCyfrUser";
import { log } from "../../utils/log";
import Avatar from "../ui/avatar";
import { CyfrLogo, HouseIcon, UserIcon } from "../ui/icons";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import ShrinkableLink from "../ui/shrinkableLink";

type NavbarProps = {
  className?: string;
  iconClassName?: string;
  pageScrolled: boolean;
};

const Navbar = ({
  className,
  iconClassName,
  pageScrolled: active,
}: NavbarProps) => {
  const [cyfrUser] = useCyfrUser();
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  useEffect(() => {
    setIsPageScrolled(active);
  }, [active]);

  return (
    <>
      <nav
        className={`
          ${className} 
          sticky top-0 
          bg-secondary 
          flex 
          z-40
          ${isPageScrolled ? "shadow-lg shadow-black" : ""}
          `}
      >
        <div className="flex justify-start">
          <ShrinkableLink
            href="/"
            label="Cyfr"
            className={`ml-1 text-primary transition-all duration-200 ease-linear ${
              active ? "mt-0" : "-mt-20"
            }`}
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
              icon={<Avatar user={cyfrUser} sz='sm' link={false} />}
              className={iconClassName}
              dir="left"
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
