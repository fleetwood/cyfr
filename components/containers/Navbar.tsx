import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import Avatar from "components/ui/avatar"
import { CyfrLogo, HouseIcon, BookIcon, UserIcon } from "components/ui/icons"
import ShrinkableIconLink from "components/ui/shrinkableIconLink"
import ShrinkableLink from "components/ui/shrinkableLink"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Book } from "prisma/prismaContext"
import { useState, useEffect, ReactNode } from "react"
import { uniqueKey, onlyFans } from "utils/helpers"

type NavbarProps = {
  className?: string
  iconClassName?: string
  pageScrolled?: boolean
  leftChildren?: ReactNode
  rightChildren?: ReactNode
}

const Navbar = ({
  className,
  iconClassName,
  leftChildren,
  rightChildren,
  pageScrolled: active,
}: NavbarProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const [showDropDown, setShowDropDown ] = useState(false)

  const userUrl = cyfrUser ? cyfrUser.name : ''

  const linkClass = 'rounded-lg hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'

  useEffect(() => {
    setIsPageScrolled(active||false)
  }, [active])

  return (
    <>
      <nav
        className={`
          ${className} 
          sticky top-0 
          bg-secondary 
          flex 
          justify-between
          z-40
          ${isPageScrolled ? "shadow-lg shadow-black" : ""}
          `}
      >
        <div className="flex flex-row justify-start">
          {active && 
            <ShrinkableLink
              href="/"
              label="Cyfr"
              className={`ml-1 text-primary transition-all duration-200 ease-linear ${
                active ? "mt-0" : "-mt-20"
              }`}
            >
              <CyfrLogo size="sm" className="text-primary" />
            </ShrinkableLink>
          }
          {leftChildren}
        </div>
        <div className={`flex flex-row nav-item dropdown static justify-end`}>
          {rightChildren}
          <ShrinkableIconLink
            href="/"
            label="Home"
            icon={HouseIcon}
            className={iconClassName}
          />
          <ShrinkableIconLink
            href="/books"
            label="Books"
            icon={BookIcon}
            className={iconClassName}
          />
          {cyfrUser ? (
            <div className="dropdown dropdown-end text-secondary-content min-w-full float-right">
              <label tabIndex={0} className="btn btn-ghost rounded-btn space-x-2" onClick={() => setShowDropDown(!showDropDown)}>
                <p>{cyfrUser.name}</p>
                <Avatar user={cyfrUser} sz='sm' link={false} variant={['no-profile']} />
              </label>


              <div className={`dropdown-content w-full top-full drop-shadow-lg bg-secondary bg-opacity-90 rounded-lg`}>
              
                <div className="grid lg:grid-cols-3 gap-6">
                  <ul className="px-4 py-2 bg-primary bg-opacity-90 rounded-l-lg">
                    {/* <h3 className="w-[100%]"><Link href={`/user/${userUrl}/books`} className='min-w-full rounded-lg hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Books</Link></h3> */}
                    {/* <ul className="col-1 p-2 text-primary-content mt-2 space-y-2"> */}
                      {/* {cyfrUser.books?.map((book:Book) => (
                      <li key={uniqueKey(book)}><Link className="hover:bg-opacity-100 hover:bg-primary hover:drop-shadow-md" href={`/book/${book.slug}`}>{book.title}</Link></li>
                      ))} */}
                    {/* </ul> */}
                  </ul>
                  <ul className="p-2 text-secondary-content mt-2 space-y-2">
                    <li><Link href="/user/inbox" className={linkClass}>Inbox</Link></li>
                    <li><Link href={`/user/${userUrl}/books`} className={linkClass}>Books</Link></li>
                    <li><Link href={`/user/${userUrl}/gallery`} className={linkClass}>Galleries</Link></li>
                    <li><Link href={`/user/${userUrl}/memberships`} className={linkClass}>Memberships</Link></li>
                    <li><Link href={`/user/${userUrl}`} className={linkClass}>Profile</Link></li>
                    <li><Link href={`/account`} className={linkClass}>Account</Link></li>
                    <li><Link href={`#`} className={linkClass} onClick={() => signOut()} >Log Out</Link></li>
                  </ul>

                  <ul className="p-2 text-secondary-content mt-2 space-y-2">
                    <li><span><b>Posts</b> cyfrUser.posts?.length</span></li>
                    <li><span><b>Followers</b> cyfrUser.followers?.length</span></li>
                    <li><span><b>Fans</b> onlyFans(cyfrUser.followers??[]).length </span></li>
                    <li><span><b>Reads</b> [NI]</span></li>
                    <li><span><b>Reviews</b> [NI]</span></li>
                  </ul>
                </div>
              
            </div>

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
  )
}

export default Navbar
