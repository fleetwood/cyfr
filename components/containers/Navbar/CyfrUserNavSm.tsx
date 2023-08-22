import {Box, IconButton, Menu, MenuItem, Typography} from '@mui/material'
import LinkWithIcon from 'components/ui/avatar/linkWithIcon'
import UserAvatar from 'components/ui/avatar/userAvatar'
import {HamburgerIcon, MuiLogoutIcon, MuiMailIcon, MuiManageAccountsIcon, MuiPeopleIcon, MuiPersonIcon, MuiPortraitIcon} from 'components/ui/icons'
import {SpinnerEllipse} from 'components/ui/spinnerEllipse'
import useDebug from 'hooks/useDebug'
import {signOut} from 'next-auth/react'
import useApi from 'prisma/useApi'
import React, {useState} from 'react'
import {VariantProps, stringToColour} from 'types/props'
import {CyfrUserNavProps, NavbarPage} from './CyfrUserNav'
import NavPageLink from './NavButton'
import {uuid} from 'utils/helpers'
import MenuLogin from 'components/ui/menuLogin'

const {debug} = useDebug('CyfrUserNav')

const CyfrUserNavSm = ({ pages }: CyfrUserNavProps) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()

  const [keystone, setKeystone] = useState<null | HTMLElement>(null)
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setKeystone(event.currentTarget)
  const handleClose = () => setKeystone(null)

  const userUrl = cyfrUser ? cyfrUser.slug : ''
  const linkClass = 'font-semibold text-primary'

  const MenuItemLinkWithIcon = ({variant, page}:{variant?: VariantProps, page:NavbarPage}) => (
    <MenuItem onClick={page.onClick}>
      <NavPageLink variant={variant??'primary'} page={page} />
    </MenuItem>)

  const cyfrPages = 
    cyfrUser ? [
      {label:"Inbox", url:"/user/inbox",icon:<MuiMailIcon /> },
      {label:"Membership", url: `/user/${userUrl}/memberships`, icon:<MuiPeopleIcon />},
      {label:"Profile",url:`/user/${userUrl}`,icon:<MuiPortraitIcon />},
      {label:"Account",url:`/account`,icon:<MuiManageAccountsIcon />},
      {label:"Logout",url:`#`,icon:<MuiLogoutIcon />,onClick:() => signOut()}
    ] 
    : []

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="Your Account"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpen}
          color="inherit"
        >
          {HamburgerIcon}
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={keystone}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(keystone)}
          onClose={handleClose}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItemLinkWithIcon key={'navbar-mobile-page-' + page.label} page={page} variant="accent" />
          ))}

          {!isLoading && cyfrUser && cyfrPages.map((page: NavbarPage) => 
            <MenuItemLinkWithIcon page={page} key={uuid()} />
          )}

          {!isLoading && !cyfrUser && (
            <MenuItem>
              <MenuLogin />
            </MenuItem>
          )}
        </Menu>
        {isLoading && <SpinnerEllipse />}
      </Box>
    </Box>
  )
}

export default CyfrUserNavSm