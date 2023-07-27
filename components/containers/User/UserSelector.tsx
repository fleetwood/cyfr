import { User, UserStub, } from 'prisma/prismaContext'
import { TailwindInput } from 'components/forms'
import React, { useEffect, useState } from 'react'
import { TailwindFormProps } from 'types/props'
import useDebounce from 'hooks/useDebounce'
import useApi from 'prisma/useApi'
import { Button, Grid, Menu, MenuItem } from '@mui/material'
import Avatar, { AvatarUser } from 'components/ui/avatar'
import { uniqueKey } from 'utils/helpers'

type UserSelectorProps = {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
    onClick?:           <T>(selected:T) => void
    select?:            'id' | 'slug' | 'User' | 'CyfrUser' | 'UserDetail' | 'UserFeed' | 'UserStub' | 'UserFollow'
}

const UserSelector = (props:UserSelectorProps) => {
  const userSelector = 'userSelector'
  const {friends } = useApi.user()
  const {cyfrUser} = useApi.cyfrUser()
  const [users, setUsers] = useState<UserStub[]>([])

  const onUserClick = (u:AvatarUser) => {
    if (!props.onClick) return
    let selected:unknown = null
    switch (props.select) {
      case 'id':
        return props.onClick(u.id)
      case 'slug':
        return props.onClick(u.slug)
      default: return props.onClick(u)
    }
  }

  const close = () => {
    toggle(false)
    // setUsers(() => [])
  }
  
  const [search, setSearch] = useState<string|null>(null)
  const findUser = useDebounce({value: search, ms: 500})
  const findUsers = async () => {
    if (!search || search.trim().length < 1) {
      setUsers(() => [])
      return
    }
    const f = await friends(cyfrUser.id, search)
    if (f && f.length>0) {
      setUsers(() => f)
      toggle(true)
    }
  }
  useEffect(() => {findUsers()}, [findUser])

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const open = search && search.trim().length > 0 && users.length > 0
  const toggle = (show=false) => setAnchor(show ? document.getElementById(userSelector) : null)

  return (
    <>
      <TailwindInput type='text' label={props.label} value={search} setValue={setSearch} />
      <span id={userSelector}></span>
      {/* {open &&
        <Menu id="basic-menu" anchorEl={anchor} open={open} onClose={close} MenuListProps={{'aria-labelledby': 'basic-button'}}>
          {users.map((u:UserStub) => 
            <MenuItem onClick={() => toggle(false)} key={uniqueKey(u.id)} ><Avatar user={u} sz='sm' /></MenuItem>
          )}
        </Menu>
      } */}
      <Grid>
        {users.map((u:UserStub) => 
          <div onClick={() => toggle(false)} key={uniqueKey(u.id)} >
            <Avatar user={u} sz='sm' onClick={onUserClick} variant={['no-profile']} className='opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200' />
          </div>
        )}
      </Grid>
    </>
  )
}

export default UserSelector