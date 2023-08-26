import {
  AppBar,
  Container,
  Grid,
  Toolbar,
  Typography
} from '@mui/material'
import {
  BookIcon,
  CommaDoorLogo,
  CyfrLogo,
  EventIcon,
  GalleryIcon,
  MuiNewspaperIcon
} from 'components/ui/icons'
import useDebug from 'hooks/useDebug'
import Link from 'next/link'
import {ReactNode, useEffect, useState} from 'react'
import CyfrUserNav from './CyfrUserNav'
import CyfrUserNavSm from './CyfrUserNavSm'
import NavPageLink from './NavButton'
import {NavPage, VariantProps} from 'types/props'

const { debug } = useDebug('Navbar')

type NavbarProps = {
  className?: string
  iconClassName?: string
  pageScrolled?: boolean
  leftChildren?: ReactNode
  rightChildren?: ReactNode
  variant?: VariantProps
}

const Navbar = ({
  className,
  iconClassName,
  leftChildren,
  rightChildren,
  pageScrolled: active,
  variant='primary'
}: NavbarProps) => {
  const pages:NavPage[] = [
    { label: 'Books', url: '/books', icon: BookIcon },
    { label: 'Galleries', url: '/galleries', icon: GalleryIcon },
    { label: 'Events', url: '/events', icon: EventIcon },
    { label: 'Articles', url: '/articles', icon: <MuiNewspaperIcon /> },
  ]

  return (
    <AppBar position="sticky" className={`bg-${variant}`}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CommaDoorLogo fill="#F6F6F4" />
          <h4 className="text-4xl font-semibold pl-2">commadoor</h4>

          <CyfrUserNavSm pages={pages} />
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
            <Link href="/">commadoor</Link>
          </Typography>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {pages.map((page) => (
              <NavPageLink
                page={page}
                variant={variant}
                key={'navbar-page-' + page.label}
              />
            ))}

            <CyfrUserNav pages={pages} />
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar