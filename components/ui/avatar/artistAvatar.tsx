import { Transition } from "@headlessui/react"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import {
  ArtistDetail,
  ArtistStub,
  MembershipType,
  UserInfo
} from "prisma/prismaContext"
import useApi from "prisma/useApi"
import { useState } from "react"
import { SizeProps } from "types/props"
import { cloudinary } from "utils/cloudinary"
import { abbrNum } from "utils/helpers"
import Spinner from "../spinner"

const {debug, jsonBlock} = useDebug('avatar')

export type ArtistUser = ArtistDetail | ArtistStub

type AvatarProps = {
  artist?: ArtistUser
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
  variant?: AvatarVariants[]
  sz: SizeProps
  onClick?: (artist:ArtistUser) => void
}

export type AvatarVariants = 'default'|'no-profile'

const ArtistAvatar = ({
  artist,
  className,
  sz,
  link = true,
  onClick,
  variant = ['default'],
}: AvatarProps) => {
  if (!artist) return <></>
  
  const [showProfile, setShowProfile] = useState(false)
  
  const {info} = useApi.user()

  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const {user} = artist

  const numBooks = userInfo?._count.books
  const numFollowers = userInfo?._count.follower
  const numFollowing = userInfo?._count.following
  const numStans = 'NI' //userInfo?._count.follower??0
  const numFans = 'NI' //userInfo?._count.following??0

  const allowProfile = variant.indexOf('no-profile')<0
  const content =
    artist && 
      user.image ? ( <img src={cloudinary.avatar(user.image, sz as unknown as SizeProps)} /> ) : 
      artist ? ( user.name ) :
      ("?")

    const online =
    // @ts-ignore
    artist && artist._count && artist._count.sessions && artist._count.sessions > 0
      ? "online"
      : ""

  // @ts-ignore
  const member = artist?.membership?.type ? (artist?.membership?.type as unknown as MembershipType).name.toLowerCase() : ''
  
  const init = async () => {
    debug('init')
    setShowProfile(() => true)
    if (userInfo) {
      debug('alreadyGotUserInfo', userInfo)
      return
    }

    if (!artist) {
      debug('aint got no artist')
      return
    }

    setIsLoading(() => true)
    debug('getting artist info....', artist.id)
    // get artist infro from api
    const result = await info(artist.id)
    
    if (result) {
      debug('userInfo', result)
      setUserInfo(() => result)
      setIsLoading(() => false)
    }
  }

  const otherClasses = [online, member, className].join(' ').trim()
  
  return (
    <div 
      className={`avatar relative ${otherClasses}`} 
      onMouseOverCapture={() => allowProfile ? init() : {}}
      onMouseOutCapture={() => setShowProfile(() => false)}
      onClickCapture={() => onClick && onClick(artist)}
    >
      <div className={`mask mask-squircle`}>
        {!onClick && link && artist ? <a href={`/artist/${user.slug}`}>{content}</a> : content}
      </div>
      {allowProfile && userInfo && 
      <Transition
        show={showProfile}
        enter="transition-all duration-200"
        enterFrom="opacity-0 invisible"
        enterTo="opacity-100"
        leave="transition-all duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 invisible"
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
                <Link href={`/artist/${user.slug}`}><h3 className="font-semibold">{userInfo?.name}</h3></Link>
              </div>

              <div className="px-3 py-2 flex flex-row">
                
                <div className="flex flex-col p-2">
                  <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Books</div>
                    <div>{numBooks}</div>
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
      }
    </div>
  )
}

export default ArtistAvatar
