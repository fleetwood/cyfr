import { Transition } from '@headlessui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import useDebug from 'hooks/useDebug'
import Link from 'next/link'
import { UserInfo } from 'prisma/prismaContext'
import UserApi from 'prisma/useApi/user'
import { abbrNum } from 'utils/helpers'
import Semibold from '../semibold'
import Spinner from '../spinner'
import UserAvatar, { AvatarUser } from './userAvatar'
import { stringToColour } from 'types/props'
import { Avatar, Box, Button, Chip, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import ShrinkableIconButton from '../shrinkableIconButton'
import ShrinkableIconLabel from '../shrinkableIconLabel'
import { FireIcon, HeartIcon, MailIcon, ShareIcon } from '../icons'
import useShareApi from 'prisma/useApi/share'
import useCyfrUserApi from 'prisma/useApi/cyfrUser'
import { useToast } from 'components/context/ToastContextProvider'
import useFeed from 'hooks/useFeed'

const { debug } = useDebug('userInfoMenu')

const UserInfoMenu = ({
  user,
  showProfile,
  setShowProfile,
}: {
  user: AvatarUser
  showProfile: boolean
  setShowProfile: Dispatch<SetStateAction<boolean>>
}) => {
  const {cyfrUser, invalidate: invalidateCyfrUser} = useCyfrUserApi()
  const { info, followUser } = UserApi()
  const { like } = useShareApi()
  const {invalidate: invalidateFeed} = useFeed('post')
  const {notify, notifyNotImplemented} = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>()

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
    const result: UserInfo = await info(user.id)

    if (result) {
      debug('userInfo', result)
      setUserInfo(() => result)
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
            <Grid xs={3}>
              <UserAvatar sz='md' user={user} variant={['no-profile']} />
            </Grid>
            <Grid xs={6}>
              <Link href={`/user/${user.slug}`}>
                <h3 className="font-semibold">{user.name}</h3>
              </Link>
              {userInfo && 
                <Typography className='font-semibold' sx={{ color: stringToColour(membershipName)}} >{userInfo.membership.type.name}</Typography>
              }
            </Grid>
          </Grid>
          
          <Container className="flex flex-row text-xs">
            {[
              {label: 'Posts', value: userInfo.posts},
              {label: 'Books', value: userInfo.books},
              {label: 'Galleries', value: userInfo.galleries},
              {label: 'Followers', value: userInfo.followers},
              {label: 'Fans', value: userInfo.fans},
              {label: 'Following', value: userInfo.following},
              {label: 'Stans', value: userInfo.stans},
            ].map(item => (
              <div className="flex border-b border-neutral border-opacity-50 justify-between space-x-2 p-2">
                <div className="font-semibold">{item.label}</div>
                <div>{abbrNum(item.value)}</div>
              </div>
            ))}
            <div className="flex border-b border-neutral border-opacity-50 justify-between space-x-2 p-2">      
              <Tooltip placement='top' title="Follow"><IconButton color='primary' onClick={() => onFollow()}>{HeartIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Fan"><IconButton color='primary' onClick={() => onFan()}>{FireIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Share"><IconButton color='primary' onClick={() => onShare()}>{ShareIcon}</IconButton></Tooltip>
              <Tooltip placement='top' title="Message"><IconButton color='primary' onClick={() => onMessage()}>{MailIcon}</IconButton></Tooltip>
            </div>
          </Container>
        
        </Box>
      )}
    </Transition>
  )
}

export default UserInfoMenu
