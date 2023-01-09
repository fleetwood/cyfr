import { GearIcon, HouseIcon, UserIcon } from "../ui/icons";
import { classnameProps } from "../../types/props";
import ShrinkableIconLink from "../ui/shrinkableIconLink";
import { useSession } from "../../lib/next-auth-react-query";
import useCyfrUser from "../../hooks/useCyfrUser";

const Navbar = ({ className }: classnameProps) => {
  const navbarClass = "";
  const [session] = useSession({ required: false });
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
            className={navbarClass}
          />
          {cyfrUser ? ( 
            <ShrinkableIconLink
            href={"/account"}
            // @ts-ignore
            label={cyfrUser.name}
            icon={GearIcon}
            className={navbarClass}
            />
          ) : (
            <ShrinkableIconLink
            href={"/login"}
            label={"Login"}
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
