import { User, UserStub, } from 'prisma/prismaContext'
import { TailwindInput } from 'components/forms'
import React, { useEffect, useState } from 'react'
import { TailwindFormProps } from 'types/props'
import useDebounce from 'hooks/useDebounce'
import useApi from 'prisma/useApi'
import { Button, Grid, Menu, MenuItem } from '@mui/material'
import Avatar from 'components/ui/avatar'
import { uniqueKey } from 'utils/helpers'

type UserSelectorProps = {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
}

const UserSelector = (props:UserSelectorProps) => {
  const userSelector = 'userSelector'
  const {friends } = useApi.user()
  const {cyfrUser} = useApi.cyfrUser()
  const [users, setUsers] = useState<UserStub[]>([])
  
  const [search, setSearch] = useState<string|null>(null)
  const findUser = useDebounce({value: search, ms: 500})
  const findUsers = async () => {
      const f = await friends(cyfrUser.id, search??undefined)
      toggle(false)
      if (f) {
        setUsers(() => f)
        f.length>0&&toggle(true)
      }
  }
  useEffect(() => {findUsers()}, [findUser])

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchor);
  const toggle = (show=false) => setAnchor(show ? document.getElementById(userSelector) : null)

  return (
    <>
      <TailwindInput type='text' label={props.label} value={search} setValue={setSearch} />
      <span id={userSelector}></span>
      <Menu id="basic-menu" anchorEl={anchor} open={open} onClose={() => toggle(false)} MenuListProps={{'aria-labelledby': 'basic-button'}}>
        {users.map((u:UserStub) => 
          <MenuItem onClick={() => toggle(false)} key={uniqueKey(u.id)} ><Avatar user={u} sz='sm' /></MenuItem>
        )}
      </Menu>
      <Grid>
      </Grid>
    </>
  )
}

export default UserSelector