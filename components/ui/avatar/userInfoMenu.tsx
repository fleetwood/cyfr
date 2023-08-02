import { Transition } from '@headlessui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'

import Link from 'next/link'
import UserApi from 'prisma/useApi/user'
import { UserInfo } from 'prisma/prismaContext'
import { AvatarUser } from './userAvatar'
import Spinner from '../spinner'
import useDebug from 'hooks/useDebug'
import { abbrNum } from 'utils/helpers'

const {debug}=useDebug('userInfoMenu')

const UserInfoMenu = ({user, showProfile, setShowProfile}:{user:AvatarUser, showProfile:boolean, setShowProfile: Dispatch<SetStateAction<boolean>>}) => {

  const {info} = UserApi()

  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const numPosts = userInfo?._count.posts
  const numGalleries = userInfo?._count.galleries
  const numBooks = userInfo?._count.books
  const numFollowers = userInfo?._count.follower
  const numFollowing = userInfo?._count.following
  const numStans = 'NI' //userInfo?._count.follower??0
  const numFans = 'NI' //userInfo?._count.following??0
  
  const init = async () => {
    debug('init')
    setShowProfile(() => true)
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
    const result = await info(user.id)
    
    if (result) {
      debug('userInfo', result)
      setUserInfo(() => result)
      setIsLoading(() => false)
    }
  }
  
  return (
    <Transition
        show={showProfile}
        enter="transition-all duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
    {isLoading && <Spinner />}
    {!isLoading && userInfo !== null &&
        <div className={`
        absolute z-10
        bg-base-300 text-base-content
        text-sm rounded-lg shadow-lg shadow-black
        `}
        >
            <div className="px-3 py-2 bg-primary text-primary-content rounded-t-lg">
            <Link href={`/user/${user.slug}`}><h3 className="font-semibold">{user.name}</h3></Link>
            </div>

            <div className="px-3 py-2 flex flex-row">
            
            <div className="flex flex-col p-2">
                <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Posts</div>
                <div>{abbrNum(numPosts)}</div>
                </div>
                <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Books</div>
                <div>{numBooks}</div>
                </div>
                <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Galleries</div>
                <div>{numGalleries}</div>
                </div>   
            </div>

            <div className="flex flex-col p-2">
                <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Followers</div>
                <div>{abbrNum(numFollowers)}</div>
                </div>
                <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Fans</div>
                <div>{numFans}</div>
                </div>
                <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Follows</div>
                <div>{abbrNum(numFollowing)}</div>
                </div>
                <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                <div className="font-semibold">Stans</div>
                <div>{numStans}</div>
                </div>
            </div>

            </div>
        </div>
    }
    </Transition>
  )
}

export default UserInfoMenu