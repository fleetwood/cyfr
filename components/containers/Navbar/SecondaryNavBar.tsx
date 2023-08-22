import {AppBar,Container,Grid,Toolbar} from '@mui/material'
import useDebug from 'hooks/useDebug'
import {NavPage, VariantProps} from 'types/props'
import NavLink from './NavLink'

const { debug } = useDebug('Navbar')

type SecondaryNavBarProps = {
  pages: NavPage[]
  selected?: number
  variant?: VariantProps
  selectedVariant?: VariantProps
}

const SecondaryNavBar = ({pages, selected, variant='primary', selectedVariant='secondary'}:SecondaryNavBarProps) => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl" className={`bg-${variant}`}>
        <Toolbar disableGutters>
          <Grid container direction="row">
            {pages.map((page, idx) => (
              <Grid item xs key={'navbar-page-' + page.label}>
                <NavLink
                  page={page}
                  variant={selected === idx ? selectedVariant : variant}
                />
              </Grid>
            ))}
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default SecondaryNavBar
