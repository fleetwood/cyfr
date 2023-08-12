import {Box, Grid, IconButton, Menu, MenuItem, Typography} from '@mui/material'
import LinkWithIcon from 'components/ui/avatar/linkWithIcon'
import UserAvatar from 'components/ui/avatar/userAvatar'
import {BookIcon, GalleryIcon, MuiLogoutIcon, MuiMailIcon, MuiManageAccountsIcon, MuiPeopleIcon, MuiPersonIcon, MuiPortraitIcon} from 'components/ui/icons'
import MenuLogin from 'components/ui/menuLogin'
import {SpinnerEllipse} from 'components/ui/spinnerEllipse'
import useDebug from 'hooks/useDebug'
import {signOut} from 'next-auth/react'
import Link from 'next/link'
import {BookStub, GalleryStub} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, {ReactNode, useState} from 'react'
import {stringToColour} from 'types/props'

const {debug} = useDebug('CyfrUserNav')

export type NavbarPage = {
  label: string
  url: string
  icon?: ReactNode
  onClick?: (e:any) => any
}
export type CyfrUserNavProps = {
  pages: NavbarPage[]
}

const CyfrUserNav = ({pages}:CyfrUserNavProps) => {
  const { cyfrUser, isLoading } = useApi.cyfrUser()

  const [keystone, setKeystone] = useState<null | HTMLElement>(null)
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setKeystone(event.currentTarget)
  const handleClose = () => setKeystone(null)

  const userUrl = cyfrUser ? cyfrUser.slug : ''
  const linkClass = 'font-semibold text-primary'

  return (
    <Box sx={{ flexGrow: 0 }}>
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
                sx={{ color: stringToColour(
                  cyfrUser.membership?.type.name ?? 'public'
                )}}>
                {cyfrUser.membership?.type.name}
              </Typography>
            </div>
            <IconButton onClick={handleOpen} sx={{ p: 0 }}>
              <UserAvatar user={cyfrUser} variant={['no-profile','no-link']} sz="md" />
            </IconButton>
          </div>
          <Menu
            sx={{ mt: 6 }}
            id="menu-appbar"
            anchorEl={keystone}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(keystone)}
            onClose={handleClose}
          >
              <MenuItem className="float-left p-2">
                <Link href={`/user/${userUrl}/books`} className={linkClass}>
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
              </MenuItem>

              <MenuItem className="float-left p-2">
                <Link href={`/user/${userUrl}/gallery`} className={linkClass}>
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
              </MenuItem>

              <MenuItem className="float-left flex flex-col p-2">
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
              </MenuItem>

              <MenuItem className="float-left flex flex-col p-2">
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
              </MenuItem>

          </Menu>
        </Box>
      ) : !isLoading ? (
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            onClick={(e) => setKeystone(e.currentTarget)}
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
            anchorEl={keystone}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(keystone)}
            onClose={() => setKeystone(null)}
          >
            <MenuItem>
              <MenuLogin />
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <SpinnerEllipse />
      )}
    </Box>
  )
}

export default CyfrUserNav