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
  GalleryIcon
} from 'components/ui/icons'
import useDebug from 'hooks/useDebug'
import Link from 'next/link'
import {ReactNode, useEffect, useState} from 'react'
import CyfrUserNav from './CyfrUserNav'
import CyfrUserNavSm from './CyfrUserNavSm'
import NavPageButton from './NavPageButton'

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
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)

  const pages = [
    { label: 'Books', url: '/books', icon: BookIcon },
    { label: 'Galleries', url: '/galleries', icon: GalleryIcon },
    { label: 'Events', url: '/events', icon: EventIcon },
  ]
  useEffect(() => {
    setIsPageScrolled(active || false)
  }, [active])


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
                variant="info"
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