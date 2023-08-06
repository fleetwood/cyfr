import { Grid } from '@mui/material'
import { TailwindInput } from 'components/forms'
import UserAvatar, { AvatarUser } from 'components/ui/avatar/userAvatar'
import useDebounce from 'hooks/useDebounce'
import { UserStub } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { useEffect, useState } from 'react'
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
    setSearch(null)
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
    // TODO: we may not always want just friends from the selector.
    //        so add a variant and change the api call here
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
            <UserAvatar user={u} sz='sm' onClick={onUserClick} variant={['no-profile']} className='opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200' />
          </div>
        )}
      </Grid>
    </>
  )
}

export default UserSelector