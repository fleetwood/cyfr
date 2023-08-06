import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { DialogContent, DialogTitle } from '@mui/material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type FullScreenDialogProps = {
    openLabel:  string
    menu?:      React.ReactNode
    children:   React.ReactNode
    scroll?:    "body" | "paper" | undefined
}

export default function FullScreenDialog(props:FullScreenDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>{props.openLabel}</Button>
      <Dialog
        scroll={props.scroll}
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle id='scroll-dialog-title'>
          <AppBar sx={{ position: 'absolute' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {props.menu??''}
            </Toolbar>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          <div className='mt-28'>
            {props.children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
