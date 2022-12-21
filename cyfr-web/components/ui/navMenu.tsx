import { MouseEventHandler, MutableRefObject, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavMenuLink = {
    label: string,
    href?: string,
    active?: boolean,
    handler?: MouseEventHandler
    ref?:MutableRefObject<any>
}

type NavMenuProps = {
    label: ReactNode,
    items: NavMenuLink[]
}

const NavLink = (item:NavMenuLink) => (
    <Link
        href={item.href!}
        className={classNames(
            item.active
            ? "bg-secondary text-secondary-content"
            : "bg-primary text-primary-content",
            "block px-4 py-2 text-sm"
        )}
        >
        {item.label}
    </Link>
)

const NavAction = (item:NavMenuLink) => (
    <button
        className={classNames(
            item.active
            ? "btn-secondary text-secondary-content"
            : "b-primary text-primary-content",
            "block px-4 py-2 text-sm"
        )}
        onClick={item.handler}
        ref={item.ref}
    >
        {item.label}
    </button>
)

export default function NavMenu(props:NavMenuProps) {
    const {label, items} = {...props}
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center">
          {label}
        </Menu.Button>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items?.map((item,index) => 
                (item.handler ? 
                    <Menu.Item key={index}>
                    {({ active }) => (                  
                        <NavAction {...item} key={index}/>
                    )}
                    </Menu.Item>
                :
                    <Menu.Item key={index}>
                    {({ active }) => (                  
                        <NavLink {...item} key={index}/>
                    )}
                    </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
