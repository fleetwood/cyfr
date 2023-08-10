import { Grid } from '@mui/material'
import { TailwindInput } from 'components/forms'
import UserAvatar, { AvatarUser } from 'components/ui/avatar/userAvatar'
import useDebounce from 'hooks/useDebounce'
import useDebug from 'hooks/useDebug'
import { Agent, Artist, Author, Editor, Follow, FollowerTypes, Reader, UserStub, UserTypes } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { useEffect, useState } from 'react'
import { uniqueKey } from 'utils/helpers'

const {debug} = useDebug('containers/User/UserSelector', 'DEBUG')

type UserSelectorProps = {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
    followerTypes?:     FollowerTypes[]
    userTypes?:         UserTypes[]
    onClick?:           <T>(selected:T) => void
    select?:            'id' | 'slug' | 'User' | 'CyfrUser' | 'UserDetail' | 'UserFeed' | 'UserStub' | 'UserFollow'
}

// TODO: create variants for:
/* 
Author, Artist, Editor, Agent, Reader, 
Follower, Stan, Following, Fan
*/
const UserSelector = (props:UserSelectorProps) => {
  const userSelector = 'userSelector'
  const {search:userSearch } = useApi.user()
  const {cyfrUser} = useApi.cyfrUser()
  // TODO: can we set this to <T> somehow?
  const [users, setUsers] = useState<any[]>([])

  const onUserClick = (u:AvatarUser) => {
    if (!props.onClick) return
    setSearch(null)
    debug('TODO: return the appropriate forType here...')
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
    debug('TODO: Switch for types...')
    const {userTypes, followerTypes} = props
    const f = await userSearch({id: cyfrUser.id, search, userTypes, followerTypes})
    if (f && f.length>0) {

      //TODO switch to a user search stub
      setUsers(() => f)
      toggle(true)
    }
  }
  useEffect(() => {findUsers()}, [findUser])
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const toggle = (show=false) => setAnchor(show ? document.getElementById(userSelector) : null)

  return (
    <>
      <TailwindInput type='text' label={props.label} value={search} setValue={setSearch} />
      <span id={userSelector}></span>
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