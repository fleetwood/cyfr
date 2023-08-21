import {Badge, Box, Grid, IconButton, Menu, MenuList, Typography, withStyles} from '@mui/material'
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
  const toggleMenu = (event?: React.MouseEvent<HTMLElement>) => setKeystone(event?.currentTarget??null)

  const userUrl = cyfrUser ? cyfrUser.slug : ''
  const linkClass = 'font-semibold px-2 text-primary hover:bg-primary hover:bg-opacity-20'
  const navLinkClass = '-ml-2 px-2 hover:bg-primary hover:bg-opacity-20 transition-color duration-200'

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
                sx={{
                  color: stringToColour(
                    cyfrUser.membership?.type.name ?? 'public'
                  ),
                }}
              >
                {cyfrUser.membership?.type.name}
              </Typography>
            </div>
            <IconButton onClick={toggleMenu} sx={{ p: 0 }}>
              <Badge badgeContent={cyfrUser.notifs.length} color="primary" overlap='circular' anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                <UserAvatar
                  user={cyfrUser}
                  variant={['no-profile', 'no-link']}
                  sz="md"
                  />
              </Badge>
            </IconButton>
          </div>
          <Menu
            sx={{ mt: 6 }}
            id="cyfruserMenu"
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
            onClose={() => toggleMenu(undefined)}
          >
            <MenuList>
              {cyfrUser.author && (
                <div className="float-left flex flex-col p-2">
                  <Link href={`/user/${userUrl}/books`} className={linkClass}>
                    <h3>Books</h3>
                  </Link>
                  {cyfrUser.author.books.map((book: BookStub) => (
                    <Link
                      className={navLinkClass}
                      href={`/book/${book.slug}`}
                      key={book.id}
                    >
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
              )}
              {cyfrUser.artist && (
                <div className="float-left flex flex-col p-2">
                  <Link href={`/user/${userUrl}/gallery`} className={linkClass}>
                    <h3>Galleries</h3>
                  </Link>
                  {cyfrUser.artist.galleries.map((gallery) => (
                    <Link
                      className={navLinkClass}
                      href={`/gallery/${gallery.id}`}
                      key={gallery.id}
                    >
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
              )}

              <div className="float-left flex flex-col p-2">
                <h3 className="text-primary">Profile</h3>
                <LinkWithIcon
                  className={navLinkClass}
                  href="/user/inbox"
                  icon={<MuiMailIcon />}
                  label="Inbox"
                />
                <LinkWithIcon
                  className={navLinkClass}
                  href={`/user/${userUrl}/memberships`}
                  icon={<MuiPeopleIcon />}
                  label="Membership"
                />
                <LinkWithIcon
                  className={navLinkClass}
                  href={`/user/${userUrl}`}
                  icon={<MuiPortraitIcon />}
                  label="Profile"
                />
                <LinkWithIcon
                  className={navLinkClass}
                  href={`/account`}
                  icon={<MuiManageAccountsIcon />}
                  label="Account"
                />
                <LinkWithIcon
                  className={navLinkClass}
                  onClick={() => signOut()}
                  icon={<MuiLogoutIcon />}
                  label="Logout"
                />
              </div>

              <div className="float-left flex flex-col p-2 opacity-100 cursor-default">
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
            </MenuList>
          </Menu>
        </Box>
      ) : !isLoading ? (
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={toggleMenu} sx={{ p: 0, color: 'white' }}>
            <MuiPersonIcon
              fontSize="large"
              className="opacity-50 border rounded-full hover:text-base-100 hover:border-base-100 hover:opacity-100 transition-all duration-200"
            />
          </IconButton>
          <Menu
            sx={{ mt: 6 }}
            id="loginMenu"
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
            onClose={() => toggleMenu(undefined)}
          >
            <MenuList>
              <div>
                <MenuLogin />
              </div>
            </MenuList>
          </Menu>
        </Box>
      ) : (
        <SpinnerEllipse />
      )}
    </Box>
  )
}

export default CyfrUserNav