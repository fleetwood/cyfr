import { useEffect, useState } from "react";
import { useCyfrUserContext } from "../context/CyfrUserProvider";
import Avatar from "../ui/avatar";
import { CyfrLogo, HouseIcon, UserIcon } from "../ui/icons";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import ShrinkableLink from "../ui/shrinkableLink";
import { useSession } from "../../lib/next-auth-react-query";
import { __cyfr_refetch__ } from "../../utils/constants";

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
  const [session] = useSession({required: false})
  const { cyfrUser, setRefetchInterval } = useCyfrUserContext();
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  useEffect(() => {
    setIsPageScrolled(active);
  }, [active]);

  useEffect(() => {
      setRefetchInterval(!cyfrUser ? session ? 100 : __cyfr_refetch__ : __cyfr_refetch__)
  }, [cyfrUser, session]);

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
              icon={<Avatar user={cyfrUser} sz="wee" link={false} />}
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
