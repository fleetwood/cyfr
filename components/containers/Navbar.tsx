import {
  AppBar,
  Box,
  Container,
  Grid,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from '@mui/material'
import LinkWithIcon from 'components/ui/avatar/linkWithIcon'
import UserAvatar from 'components/ui/avatar/userAvatar'
import {
  BookIcon,
  CyfrLogo,
  EventIcon,
  GalleryIcon,
  HamburgerIcon,
  MuiLogoutIcon,
  MuiMailIcon,
  MuiManageAccountsIcon,
  MuiPeopleIcon,
  MuiPersonIcon,
  MuiPortraitIcon,
} from 'components/ui/icons'
import MenuLogin from 'components/ui/menuLogin'
import { SpinnerEllipse } from 'components/ui/spinnerEllipse'
import useDebug from 'hooks/useDebug'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { BookStub, GalleryStub, UserInfo } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import UserApi from 'prisma/useApi/user'
import { ReactNode, useEffect, useState } from 'react'
import { VariantProps, stringToColour } from 'types/props'

const { debug } = useDebug('Navbar')

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
  const { cyfrUser, isLoading } = useApi.cyfrUser()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const { info } = UserApi()
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)

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
    { label: 'Books', url: '/books', icon: BookIcon },
    { label: 'Galleries', url: '/galleries', icon: GalleryIcon },
    { label: 'Events', url: '/events', icon: EventIcon },
  ]

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  useEffect(() => {
    setIsPageScrolled(active || false)
  }, [active])

  useEffect(() => {
    if (isLoading == false && cyfrUser) getInfo()
  }, [isLoading])

  const PageButton = ({
    page,
    variant,
  }: {
    page: any
    variant: VariantProps
  }) => (
    <Link
      href={page.url}
      className={`
    text-${variant} font-semibold 
    hover:text-base-100 hover:bg-${variant} 
    flex space-x-2 py-2 px-4
    transition-all duration-200
  `}
    >
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
              px: 2,
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
              aria-label="Your Account"
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
              {pages.map((page) => (
                <PageButton page={page} variant="accent" />
              ))}
              {!isLoading && cyfrUser ? (
                <>
                  <div className="flex flex-row bg-base-200 rounded-full pl-4 m-2">
                    <div className="text-right pr-2 cursor-default">
                      <span className="font-semibold text-base-content">
                        {cyfrUser.name}
                      </span>
                      <br />
                      <Typography
                        className="font-semibold"
                        sx={{
                          color: stringToColour(
                            cyfrUser.membership?.type.name ?? 'public'
                          ),
                        }}
                      >
                        {cyfrUser.membership?.type.name}
                      </Typography>
                    </div>
                    <UserAvatar
                      user={cyfrUser}
                      variant={['no-profile']}
                      sz="md"
                      link={true}
                    />
                  </div>
                  <LinkWithIcon
                    className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                    href="/user/inbox"
                    icon={<MuiMailIcon />}
                    label="Inbox"
                  />
                  <LinkWithIcon
                    className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                    href={`/user/${userUrl}/memberships`}
                    icon={<MuiPeopleIcon />}
                    label="Membership"
                  />
                  <LinkWithIcon
                    className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                    href={`/user/${userUrl}`}
                    icon={<MuiPortraitIcon />}
                    label="Profile"
                  />
                  <LinkWithIcon
                    className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                    href={`/account`}
                    icon={<MuiManageAccountsIcon />}
                    label="Account"
                  />
                  <LinkWithIcon
                    className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                    href={`#`}
                    onClick={() => signOut()}
                    icon={<MuiLogoutIcon />}
                    label="Logout"
                  />
                </>
              ) : !isLoading ? (
                <LinkWithIcon
                  className="py-2 px-4 hover:text-base-100 hover:bg-primary"
                  href={`/login`}
                  icon={<MuiPersonIcon />}
                  label="Login"
                />
              ) : (
                <SpinnerEllipse />
              )}
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
            <Link href="/">Cyfr</Link>
          </Typography>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {pages.map((page) => (
              <PageButton page={page} variant="info" />
            ))}

            {!isLoading && cyfrUser ? (
              <Box sx={{ flexGrow: 0 }}>
                <div className="flex flex-row bg-base-200 rounded-full pl-4">
                  <div className="text-right pr-2 cursor-default">
                    <span className="font-semibold text-base-content">
                      {cyfrUser.name}
                    </span>
                    <br />
                    <Typography
                      className="font-semibold"
                      sx={{
                        color: stringToColour(
                          cyfrUser.membership?.type.name ?? 'public'
                        ),
                      }}
                    >
                      {cyfrUser.membership?.type.name}
                    </Typography>
                  </div>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <UserAvatar
                      user={cyfrUser}
                      variant={['no-profile']}
                      sz="md"
                      onClick={() => {}}
                    />
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
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    className="px-4 py-2"
                  >
                    <div className="p-2">
                      <Link
                        href={`/user/${userUrl}/books`}
                        className={linkClass}
                      >
                        <h3 className="text-primary">Books</h3>
                      </Link>
                      {cyfrUser.books.map((book: BookStub) => (
                        <Link href={`/book/${book.slug}`} key={book.id}>
                          {book.title}
                        </Link>
                      ))}
                      <Link
                        href={`/user/${userUrl}/books`}
                        className="btn btn-primary btn-sm text-sm"
                        title="Start a New Book!"
                      >
                        {BookIcon} +
                      </Link>
                    </div>

                    <div className="p-2">
                      <Link
                        href={`/user/${userUrl}/gallery`}
                        className={linkClass}
                      >
                        <h3 className="text-primary">Galleries</h3>
                      </Link>
                      {cyfrUser.galleries.map((gallery: GalleryStub) => (
                        <Link href={`/gallery/${gallery.id}`} key={gallery.id}>
                          {gallery.title}
                        </Link>
                      ))}
                      <Link
                        href={`/user/${userUrl}/gallery`}
                        className="btn btn-primary btn-sm text-sm"
                        title="Start a New Gallery!"
                      >
                        {GalleryIcon}+
                      </Link>
                    </div>

                    <div className="flex flex-col p-2">
                      <h3 className="text-primary">Profile</h3>
                      <LinkWithIcon
                        href="/user/inbox"
                        icon={<MuiMailIcon />}
                        label="Inbox"
                      />
                      <LinkWithIcon
                        href={`/user/${userUrl}/memberships`}
                        icon={<MuiPeopleIcon />}
                        label="Membership"
                      />
                      <LinkWithIcon
                        href={`/user/${userUrl}`}
                        icon={<MuiPortraitIcon />}
                        label="Profile"
                      />
                      <LinkWithIcon
                        href={`/account`}
                        icon={<MuiManageAccountsIcon />}
                        label="Account"
                      />
                      <LinkWithIcon
                        onClick={() => signOut()}
                        icon={<MuiLogoutIcon />}
                        label="Logout"
                      />
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
            ) : !isLoading ? (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, color: 'white' }}
                >
                  <MuiPersonIcon
                    fontSize="large"
                    className="opacity-50 border rounded-full hover:text-base-100 hover:border-base-100 hover:opacity-100 transition-all duration-200"
                  />
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
            ) : (
              <SpinnerEllipse />
            )}
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
