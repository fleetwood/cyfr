import LogoutIcon from '@mui/icons-material/Logout'
import MailIcon from '@mui/icons-material/Mail'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PeopleIcon from '@mui/icons-material/People'
import PortraitIcon from '@mui/icons-material/Portrait'
import { AppBar, Box, Container, Grid, IconButton, Menu, Toolbar, Typography } from "@mui/material"
import LinkWithIcon from 'components/ui/avatar/linkWithIcon'
import UserAvatar from "components/ui/avatar/userAvatar"
import { BookIcon, CyfrLogo, EventIcon, GalleryIcon, HamburgerIcon, UserIcon } from "components/ui/icons"
import MenuLogin from "components/ui/menuLogin"
import { SpinnerEllipse } from "components/ui/spinnerEllipse"
import useDebug from "hooks/useDebug"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { BookStub, GalleryStub, UserInfo } from "prisma/prismaContext"
import useApi from "prisma/useApi"
import UserApi from "prisma/useApi/user"
import { ReactNode, useEffect, useState } from "react"
import { stringToColour } from "types/props"

const {debug} = useDebug('Navbar')

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
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const {info} = UserApi()
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const [showDropDown, setShowDropDown ] = useState(false)

  const userUrl = cyfrUser ? cyfrUser.slug : ''

  const linkClass = 'font-semibold text-primary'

  const getInfo = async () => {
    debug('getInfo', cyfrUser.id)
    if (!cyfrUser.id) return
    const result = await info(cyfrUser.id)
    if (result) {
      debug('gotInfo', result)
      setUserInfo(() => result)
    }
  }

  const pages = [
    {label: 'Books', url: '/books', icon: BookIcon},
    {label: 'Galleries', url: '/galleries', icon: GalleryIcon},
    {label: 'Events', url: '/events', icon: EventIcon},
  ]

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    setIsPageScrolled(active||false)
  }, [active])

  useEffect(() => {
    if (isLoading == false && cyfrUser) getInfo()
  }, [isLoading])

const PageButton = ({page, variant}:{page: any, variant: 'primary'|'secondary'}) => (
  <Link href={page.url} className={`
    text-${variant} font-semibold 
    hover:text-base-100 hover:bg-${variant} 
    flex p-2 space-x-2
    ${variant === 'primary' && 'border-l-2 border-opacity-25 last-of-type:border-x-2'}
    transition-all duration-200
  `}>
    <span>{page.icon}</span>
    <span>{page.label}</span>
  </Link>
)

  return (
    <AppBar position="static">
      <Container maxWidth="xl" className="bg-secondary">
        <Toolbar disableGutters>
          
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Cyfr
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {HamburgerIcon}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (<PageButton page={page} variant='primary'/> ))}
            </Menu>
          </Box>
          
            <CyfrLogo size="sm" />
            <Typography
              variant="h4"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                textDecoration: 'none',
              }}
              >
              <Link href='/'>
                Cyfr
              </Link>
            </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 2 }}>
            {pages.map((page) => (<PageButton page={page} variant='primary'/> ))}
          </Box>

          {!isLoading && cyfrUser ? 
            <Box sx={{ flexGrow: 0 }}>
              <div className="flex flex-row bg-base-200 rounded-full pl-4">
                <div className="text-right pr-2 cursor-default">
                  <span className="font-semibold text-base-content">{cyfrUser.name}</span><br/>
                  <Typography className='font-semibold' sx={{ color: stringToColour(cyfrUser.membership?.type.name??'public')}} >{cyfrUser.membership?.type.name}</Typography>
                </div>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <UserAvatar user={cyfrUser} variant={['no-profile']} sz="md" onClick={() => {}} />
                </IconButton>
              </div>
              <Menu
                sx={{ mt: 6 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Grid container direction='row' justifyContent='space-between' className="px-4 py-2">
                  
                  {cyfrUser.books.length>0 && 
                  <div className="p-2">
                    <Link href={`/user/${userUrl}/books`} className={linkClass}><h3 className="text-primary">Books</h3></Link>
                    {cyfrUser.books.map((book:BookStub) => <Link href={`/book/${book.slug}`}>{book.title}</Link>)}
                  </div>
                  }

                  {cyfrUser.galleries.length>0 && 
                  <div className="p-2">
                    <Link href={`/user/${userUrl}/gallery`} className={linkClass}><h3 className="text-primary">Galleries</h3></Link>
                    {cyfrUser.galleries.map((gallery:GalleryStub) => <Link href={`/gallery/${gallery.id}`}>{gallery.title}</Link>)}
                  </div>
                  }

                  <div className="flex flex-col p-2">
                    <h3 className="text-primary">Profile</h3>
                    <LinkWithIcon href='/user/inbox' icon={<MailIcon />} label='Inbox' />
                    <LinkWithIcon href={`/user/${userUrl}/memberships`} icon={<PeopleIcon />} label='Membership' />
                    <LinkWithIcon href={`/user/${userUrl}`} icon={<PortraitIcon />} label='Profile' />
                    <LinkWithIcon href={`/account`} icon={<ManageAccountsIcon />} label='Account' />
                    <LinkWithIcon href={`#`} onClick={() => signOut()} icon={<LogoutIcon />} label='Logout' />
                  </div>
                  
                  <div className="flex flex-col p-2">
                    <h3 className="text-primary">Info</h3>
                    <div className="flex flex-row justify-between">
                      <span className="font-semibold">Posts</span> 
                      <span>{cyfrUser._count.posts}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-semibold">Followers</span> 
                      <span>{cyfrUser._count.follower}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-semibold">Following</span> 
                      <span>{cyfrUser._count.following}</span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-semibold">Fans</span> 
                      <span>[NI]</span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-semibold">Reads</span> 
                      <span>[NI]</span>
                    </div>
                    <div className="flex flex-row justify-between space-x-2">
                      <span className="font-semibold">Reviews</span> 
                      <span>[NI]</span>
                    </div>
                  </div>

                </Grid>
              </Menu>
            </Box>
          : !isLoading ?
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
                Login &nbsp;{UserIcon}
              </IconButton>
                <Menu
                  sx={{ mt: 6 }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuLogin />
                </Menu>
            </Box>
          : <SpinnerEllipse />
          }
        </Toolbar>
      </Container>
    </AppBar>
    
      // <nav
      //   className={`
      //     ${className} 
      //     sticky top-0 
      //     bg-secondary 
      //     z-40
      //     ${isPageScrolled ? "shadow-lg shadow-black" : ""}
      //     `}
      //   >
      //   <Box sx={{display: 'flex'}}>
      //     <Box>
      //       {active && 
      //           <ShrinkableLink
      //           href="/"
      //           label="Cyfr"
      //           className={`ml-1 text-primary transition-all duration-200 ease-linear ${
      //             active ? "mt-0" : "-mt-20"
      //           }`}
      //           >
      //           <CyfrLogo size="sm" className="text-primary" />
      //           </ShrinkableLink>
      //         }
      //     </Box>
      //     <Box className='border-1 border-red-600' sx={{flexGrow: 1}}>
      //     </Box>
      //     <Box sx={{display: 'flex', justifyItems: 'flex-end'}}>
      //         {rightChildren}
      //         <ShrinkableIconLink
      //           href="/books"
      //           label="Books"
      //           icon={BookIcon}
      //           className={iconClassName}
      //         />
      //         {cyfrUser ? (
      //           <div className="dropdown dropdown-end text-secondary-content min-w-full float-right">
      //             <label tabIndex={0} className="btn btn-ghost rounded-btn space-x-2" onClick={() => setShowDropDown(!showDropDown)}>
      //               <p>{cyfrUser.name}</p>
      //               <UserAvatar user={cyfrUser} sz='sm' link={false} variant={['no-profile']} />
      //             </label>

      //             <div className={`dropdown-content w-full top-full drop-shadow-lg bg-secondary bg-opacity-90 rounded-lg`}>
                  
      //               <div className="grid lg:grid-cols-3 gap-6">
      //                 <ul className="px-4 py-2 bg-primary bg-opacity-90 rounded-l-lg">
      //                   <h3 className="w-[100%]"><Link href={`/user/${userUrl}/books`} className='min-w-full rounded-lg hover:bg-opacity-100 hover:bg-secondary hover:drop-shadow-md'>Books</Link></h3>
      //                   <ul className="col-1 p-2 text-primary-content mt-2 space-y-2">
      //                     {cyfrUser.books?.map((book:BookStub) => (
      //                       <li key={uniqueKey(book)}>
      //                         <Link className="hover:bg-opacity-100 hover:bg-primary hover:drop-shadow-md" 
      //                           href={`/book/${book?.slug}`}>
      //                             {book.title}
      //                         </Link>
      //                       </li>
      //                     ))}
      //                   </ul>
      //                 </ul>
      //                 <ul className="p-2 text-secondary-content mt-2 space-y-2">
      //                   <li><Link href="/user/inbox" className={linkClass}>Inbox</Link></li>
      //                   <li><Link href={`/user/${userUrl}/books`} className={linkClass}>Books</Link></li>
      //                   <li><Link href={`/user/${userUrl}/gallery`} className={linkClass}>Galleries</Link></li>
      //                   <li><Link href={`/user/${userUrl}/memberships`} className={linkClass}>Memberships</Link></li>
      //                   <li><Link href={`/user/${userUrl}`} className={linkClass}>Profile</Link></li>
      //                   <li><Link href={`/account`} className={linkClass}>Account</Link></li>
      //                   <li><Link href={`#`} className={linkClass} onClick={() => signOut()} >Log Out</Link></li>
      //                 </ul>

      //                 {userInfo &&
      //                 <ul className="p-2 text-secondary-content mt-2 space-y-2">
      //                   <li><span><b>Posts</b> {cyfrUser._count.posts}</span></li>
      //                   <li><span><b>Followers</b>{cyfrUser._count.follower}</span></li>
      //                   <li><span><b>Fans</b> [NI] </span></li>
      //                   <li><span><b>Reads</b> [NI]</span></li>
      //                   <li><span><b>Reviews</b> [NI]</span></li>
      //                 </ul>
      //                 }
      //               </div>
                  
      //             </div>

      //           </div>
      //         ) : (
      //           <ShrinkableIconLink
      //             href={"/login"}
      //             label={"Login"}
      //             icon={UserIcon}
      //             className={iconClassName}
      //           />
      //         )}
      //     </Box>
      //   </Box>
      
      // </nav>
    
  )
}

export default Navbar
