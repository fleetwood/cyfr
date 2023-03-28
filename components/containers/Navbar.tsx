import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCyfrUserContext } from "../context/CyfrUserProvider";
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
  const [cyfrUser] = useCyfrUserContext();
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  const userUrl = cyfrUser ? cyfrUser.name : ''

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
            <div className="dropdown dropdown-end text-secondary-content">
            <label tabIndex={0} className="btn btn-ghost rounded-btn space-x-2">
              <p>{cyfrUser.name}</p>
              <Avatar user={cyfrUser} sz='sm' link={false} />
            </label>
            <ul tabIndex={0} className="menu dropdown-content p-2 drop-shadow-lg bg-secondary text-secondary-content bg-opacity-75 rounded-box mt-2 space-y-2 w-[400px]">
              <li><Link href="/user/inbox" className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Inbox</Link></li>
              <li><Link href={`/user/${userUrl}/books`} className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Books</Link></li>
              <li><Link href={`/user/${userUrl}/gallery`} className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Galleries</Link></li>
              <li><Link href={`/user/${userUrl}`} className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Profile</Link></li>
              <li><Link href={`/account`} className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Account</Link></li>
              <li><Link href={`#`} className='hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md' onClick={() => signOut()} >Log Out</Link></li>
            </ul>
          </div>
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
