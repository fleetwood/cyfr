import {
  AppBar,
  Container,
  Grid,
  Toolbar,
  Typography
} from '@mui/material'
import {
  BookIcon,
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
import NavPageButton from './NavPageButton'
import {VariantProps} from 'types/props'

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
  const pages = [
    { label: 'Books', url: '/books', icon: BookIcon },
    { label: 'Galleries', url: '/galleries', icon: GalleryIcon },
    { label: 'Events', url: '/events', icon: EventIcon },
    { label: 'Articles', url: '/articles', icon: <MuiNewspaperIcon /> },
  ]

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl" className={`bg-${variant}`}>
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

          <CyfrUserNavSm pages={pages} />

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
              <NavPageButton
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