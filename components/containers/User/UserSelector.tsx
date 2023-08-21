import {Grid, Typography} from '@mui/material'
import {TailwindInput} from 'components/forms'
import UserAvatar, {AvatarUser} from 'components/ui/avatar/userAvatar'
import {SpinnerEllipse} from 'components/ui/spinnerEllipse'
import useDebounce from 'hooks/useDebounce'
import useDebug from 'hooks/useDebug'
import {FollowerTypes, UserSearchProps, UserSearchStub, UserStub, UserTypes} from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, {useEffect, useState} from 'react'
import {uniqueKey} from 'utils/helpers'

const {debug} = useDebug('containers/User/UserSelector')

/**
 * @prop userTypes  {@link UserTypes}|{@link FollowerTypes}
 */
type UserSelectorProps = UserSearchProps & {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
    returnType?:        UserTypes|FollowerTypes
    onClick?:           (selected:any) => void
}

// TODO: create variants for:
/* 
Author, Artist, Editor, Agent, Reader, 
Follower, Stan, Following, Fan
*/
const UserSelector = (props:UserSelectorProps) => {
  const userSelector = 'userSelector'
  const {search:userSearch } = useApi.user()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserSearchStub[]>([])

  const onUserClick = (user:any) => {
    if (!props.onClick) return
    setSearch(null)
    
    const u = users.find(u => u.id === user.id)
    if (!u) {
      debug(`Didn't find a match for`, {user})
      return
    }

    switch (props.returnType) {
      // UserTypes
      case 'Agent':
        return props.onClick(u.agent)
      case 'Artist':
        return props.onClick(u.artist)
      case 'Author':
        return props.onClick(u.author)
      case 'Editor':
        return props.onClick(u.editor)
      case 'Reader':
        return props.onClick(u.reader)
      // FollowerTypes
      case 'Followers':
      case 'Fans':
        return props.onClick(u.follower)
      case 'Following':
      case 'Stans':
        return props.onClick(u.following)
      // UserStub
      default:
        return props.onClick(u as UserStub)
    }
  }

  const onAvatarClick = (av:AvatarUser) => {
    const user = users.find(u => props.id === av.id)
    if (user) onUserClick(user)
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
      setIsLoading(() => false)
      return
    }
    setIsLoading(() => true)

    const {id, userTypes, followerTypes, agg} = props
    debug('searchProps', { id, userTypes, followerTypes, agg })
    const f = await userSearch({id, search, userTypes, followerTypes, agg})
    setUsers(() => f)
    setIsLoading(() => false)
    toggle(true)
  }
  useEffect(() => {findUsers()}, [findUser])
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const toggle = (show=false) => setAnchor(show ? document.getElementById(userSelector) : null)

  return (
    <>
      <TailwindInput
        type="text"
        label={props.label}
        value={search}
        setValue={setSearch}
      />
      <span id={userSelector}></span>
      <Grid>
        {isLoading && <SpinnerEllipse />}
        {users.map((u: UserSearchStub) => (
          <div onClick={() => toggle(false)} key={uniqueKey(u.id)}>
            <UserAvatar
              user={u as UserStub}
              sz="sm"
              onClick={onUserClick}
              variant={['no-profile']}
              className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200"
            />
          </div>
        ))}
        {!isLoading && users && users.length < 1 && (
          <>
            <Typography className='flex'>
              No matches for:
              <span className='pl-2 flex space-x-2'>
                {props.userTypes && <>{props.userTypes.flatMap((a) => a)},</>}
              </span>
              <span className='pl-2 flex space-x-2'>
              {props.followerTypes && (
                <>{props.followerTypes.flatMap((a) => a)}</>
              )}
              </span>
            </Typography>
          </>
        )}
      </Grid>
    </>
  )
}

export default UserSelector