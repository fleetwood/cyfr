import * as React from 'react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Stack from '@mui/material/Stack'
import {KeyVal} from 'types/props'
import {MuiArrowDownIcon} from './icons'
import {Grid} from '@mui/material'
import {domRef, uuid} from 'utils/helpers'

type DropdownMenuProps = {
  label?:           string
  className?:       string
  itemClassName?:   string
  labelClassName?:  string
  items:            KeyVal[]
  value:            any
  setValue:         (val:any) => void
}

export default function DropdownMenu({label, className, itemClassName, labelClassName, items, value, setValue}:DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClick = (item:KeyVal) => {
    setValue(() => item.value??item.key)
    setOpen(false)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <Stack direction="row" spacing={2}>
      <div className={className}>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          className={labelClassName}
          onClick={handleToggle}
        >
          <span>{label ?? value}</span>
          <MuiArrowDownIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          className='z-50'
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {items.map((item: KeyVal) => (
                      <MenuItem
                        onClick={() => handleClick(item)}
                        key={uuid()}
                        className="border-b border-neutral border-opacity-50"
                      >
                        <div className="flex flex-col min-w-full pb-1">
                          <div className={itemClassName}>{item.key}</div>
                          {item.description && <div>{item.description}</div>}
                        </div>
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  )
}
