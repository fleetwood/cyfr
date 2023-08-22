import {Transition} from '@headlessui/react'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'

import {Box, Container, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import {useToast} from 'components/context/ToastContextProvider'
import useDebug from 'hooks/useDebug'
import useFeed from 'hooks/useFeed'
import Link from 'next/link'
import {UserInfo, UserInfoType, UserTypes} from 'prisma/prismaContext'
import useCyfrUserApi from 'prisma/useApi/cyfrUser'
import useShareApi from 'prisma/useApi/share'
import UserApi from 'prisma/useApi/user'
import {KeyVal, stringToColour} from 'types/props'
import {abbrNum, uuid} from 'utils/helpers'
import {FireIcon, HeartIcon, MuiMailIcon, ShareIcon} from '../icons'
import Spinner from '../spinner'
import UserAvatar, {AvatarUser} from './userAvatar'
import {UserInfoValues} from 'utils/helpers/user'

const { debug } = useDebug('userInfoMenu')

type UserInfoMenuProps = {
  user:           AvatarUser
  userType?:      UserTypes
  showProfile:    boolean
  setShowProfile: Dispatch<SetStateAction<boolean>>
}

const UserInfoMenu = ({
  user,
  userType,
  showProfile,
  setShowProfile,
}:UserInfoMenuProps) => {
  const {cyfrUser, invalidate: invalidateCyfrUser} = useCyfrUserApi()
  const { info, followUser } = UserApi()
  const { like } = useShareApi()
  const {invalidate: invalidateFeed} = useFeed('post')
  const {notify, notifyNotImplemented} = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [userData, setUserData] = useState<KeyVal[]>([])

  const membershipName = userInfo?.membership.type.name.toLowerCase() ?? 'member'
  const memberColor = stringToColour(membershipName)
  const memberBorder = `border-[${memberColor}]`
  const memberText = `text-[${memberColor}]`

  const init = async () => {
    debug('init')
    if (userInfo) {
      debug('alreadyGotUserInfo', userInfo)
      return
    }

    if (!user) {
      debug('aint got no user')
      return
    }

    setIsLoading(() => true)
    debug('getting user info....', user.id)
    // get user infro from api
    const result: UserInfoType = await info(user.id, userType)

    if (result) {
      debug('userInfo', result)
      setUserInfo(() => result)
      setUserData(() => UserInfoValues(result))
      setIsLoading(() => false)
    }
  }

  const invalidate = () => {
    setUserInfo(() => undefined)
    invalidateCyfrUser()
    invalidateFeed()
    init()
  }

  const onLike = () => {
    notifyNotImplemented()
  }
  
  const onShare = () => {
    notifyNotImplemented()
  }
  
  const onMessage = () => {
    notifyNotImplemented()
  }

  const onFollow = async () => {
    const followed = await followUser({followerId: cyfrUser.id, followingId: user.id})
    if (followed) {
      notify(`You are now following ${user.name}!`)
      invalidate()
    }
  }

  const onFan = async () => {
    const fan = await followUser({followerId: cyfrUser.id, followingId: user.id, isFan: true})
    if (fan) {
      notify(`You are now stanning ${user.name}! Nice!!`)
      invalidate()
    }
  }

  useEffect(() => {init()}, [showProfile])

  return (
    <Transition
      show={showProfile}
      enter="transition-all duration-200"
      enterFrom="hidden opacity-0"
      enterTo="inline opacity-100"
      leave="transition-all duration-200"
      leaveFrom="inline opacity-100"
      leaveTo="hidden opacity-0"
    >
      {isLoading && <Spinner />}
      {!isLoading && userInfo && (
        <Box sx={{
            border: 2,
            borderColor: stringToColour(membershipName)
          }}
          className='absolute z-[1000] bg-base-100 shadow-xl shadow-black -mt-12'
          >
          <Grid container className='flex justify-items-start space-x-2'>
            <Grid item xs={3}>
              <UserAvatar sz='md' user={user} variant={['no-profile']} />
            </Grid>
            <Grid item xs={6}>
              <Link href={`/user/${user.slug}`}>
                <h3 className="font-semibold">{user.name}</h3>
              </Link>
              {userInfo && 
                <Typography className='font-semibold' sx={{ color: stringToColour(membershipName)}} >{userType ?? userInfo.membership.type.name}</Typography>
              }
            </Grid>
          </Grid>
          
          <Container className="flex flex-row text-xs">
            {userData.map(item => (
              <div className="flex border-b border-neutral border-opacity-50 justify-between space-x-2 p-2" key={`${user.id}-${item.key}-${uuid()}`}>
                <div className="font-semibold">{item.key}</div>
                <div>{abbrNum(Number(item.value??0))}</div>
              </div>
            ))}
            <div className="flex border-b border-neutral border-opacity-50 justify-between space-x-2 p-2">      
              <Tooltip placement='top' title="Follow"><IconButton color='primary' onClick={() => onFollow()}>{HeartIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Fan"><IconButton color='primary' onClick={() => onFan()}>{FireIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Share"><IconButton color='primary' onClick={() => onShare()}>{ShareIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Message"><IconButton color='primary' onClick={() => onMessage()}><MuiMailIcon /></IconButton></Tooltip>
            </div>
          </Container>
        
        </Box>
      )}
    </Transition>
  )
}

export default UserInfoMenu
