import { GearIcon, HouseIcon, UserIcon } from "../ui/icons";
import { classnameProps } from "../../types/props";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import { useSession } from "../../lib/next-auth-react-query";
import NavMenu from "../ui/navMenu";
import { signOut } from "next-auth/react";
import { useRef } from "react";

const Navbar = ({ className }: classnameProps) => {
  const navbarClass = "";
  const [session] = useSession({required:false})

  return (
    <>
      <nav
        className={`${className} sticky top-0 border-b-[1px] bg-secondary border-b-secondary-content mx-auto flex max-w-5xl flex-col items-center justify-center z-50`}
      >
        <div
          className={`mx-auto max-w-5xl space-x-6 text-secondary-content mr-2 my-2 flex`}
        >
          <ShrinkableIconLink
            href="/"
            label="Home"
            icon={HouseIcon}
            className={navbarClass}
          />
          
          {session ? (
            <ShrinkableIconLink
              href='/account'
              label="Account"
              icon={GearIcon}
              className={navbarClass}
              />
          ) : (
            <ShrinkableIconLink
              href="/login"
              label="Login"
              icon={UserIcon}
              className={navbarClass}
            />
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
