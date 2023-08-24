import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SlideProps
} from '@mui/material'
import EZButton from 'components/ui/ezButton'
import { XIcon } from 'components/ui/icons'
import React, { ReactNode } from 'react'
import { VariantProps } from 'types/props'
import MuiTransition from './muiTransition'

type OpenDialogProps = {
  btnClassname?:    string
  label?:           ReactNode
  labelClassname?:  string
  title?:           ReactNode
  titleClassname?:  string
  content:          ReactNode
  contentClassname?:string
  footer?:          ReactNode
  footerClassname?: string
  variant?:         VariantProps
  onConfirm?:       () => void
  onCancel?:        () => void
  warnOn?:          'OK' | 'CANCEL'
  direction?:       SlideProps["direction"]
}

const OpenDialog = (props:OpenDialogProps) => {
  const {
    onConfirm=()=>{}, 
    onCancel=()=>{},
    variant='primary',
    direction='up'
  }=props
  const [open, setOpen] = React.useState(false)
  
  const openDialog = (setTo = !open) => {
    setOpen(setTo)
  }

  const confirm = () => {
    openDialog(false)
    onConfirm()
  }

  const cancel = () => {
    openDialog(false)
    onCancel()
  }

  return (
    <>
      <EZButton
        label={props.label ?? 'Open'}
        className={props.btnClassname ?? 'btn-sm'}
        onClick={() => openDialog(true)}
        variant={variant}
      />
      <Dialog
        open={open}
        TransitionComponent={MuiTransition(direction)}
        keepMounted
        onClose={() => openDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Box className="flex justify-evenly">
            {props.title &&
              <div className={props.titleClassname ?? ''}>
                {props.title}
              </div>
            }
            <Box sx={{ flex: '1 1 auto' }} />
            {!props.onCancel && !props.onConfirm &&
              <EZButton
              label={XIcon}
              variant={variant}
              className="btn-sm btn-circle text-base-content -mt-2 -mr-4"
              onClick={() => openDialog(false)}
              />
            }
          </Box>
        </DialogTitle>
        <DialogContent>
            <div
              className={`flex flex-col space-y-3 ${
                props.contentClassname ?? ''
              }`}
            >
              {props.content}
            </div>
            {(props.onConfirm || props.onCancel) && (
              <Box className="flex justify-evenly space-x-2">
                <Box sx={{ flex: '1 1 auto' }} />
                {/* We are checking if these values are set on props, 
                  not on the destructured values, since they have noops
                  to make the click handler syntax cleaner
                */}
                {props.onConfirm && 
                  <EZButton label="OK" onClick={confirm} variant={props.warnOn === 'OK' ? 'warning' : variant} />
                }
                {props.onCancel && 
                  <EZButton label="CANCEL" onClick={cancel} variant={props.warnOn === 'CANCEL' ? 'warning' : variant} />
                }
              </Box>
            )}
        </DialogContent>
        {props.footer && (
          <DialogActions>
            <div className={props.footerClassname ?? ''}>{props.footer}</div>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default OpenDialog