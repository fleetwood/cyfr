import { Transition } from "@headlessui/react"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import {
  AgentDetail,
  AgentStub,
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

export type AgentUser = AgentDetail | AgentStub

type AvatarProps = {
  agent?: AgentUser
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
  variant?: AvatarVariants[]
  sz: SizeProps
  onClick?: (agent:AgentUser) => void
}

export type AvatarVariants = 'default'|'no-profile'

const EditorAvatar = ({
  agent,
  className,
  sz,
  link = true,
  onClick,
  variant = ['default'],
}: AvatarProps) => {
  if (!agent) return <></>
  
  const [showProfile, setShowProfile] = useState(false)
  
  const {info} = useApi.user()

  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const {user} = agent

  const numBooks = userInfo?._count.books
  const numFollowers = userInfo?._count.follower
  const numFollowing = userInfo?._count.following
  const numStans = 'NI' //userInfo?._count.follower??0
  const numFans = 'NI' //userInfo?._count.following??0

  const allowProfile = variant.indexOf('no-profile')<0
  const content =
    agent && 
      user.image ? ( <img src={cloudinary.avatar(user.image, sz as unknown as SizeProps)} /> ) : 
      agent ? ( user.name ) :
      ("?")

    const online =
    // @ts-ignore
    agent && agent._count && agent._count.sessions && agent._count.sessions > 0
      ? "online"
      : ""

  // @ts-ignore
  const member = agent?.membership?.type ? (agent?.membership?.type as unknown as MembershipType).name.toLowerCase() : ''
  
  const init = async () => {
    debug('init')
    setShowProfile(() => true)
    if (userInfo) {
      debug('alreadyGotUserInfo', userInfo)
      return
    }

    if (!agent) {
      debug('aint got no agent')
      return
    }

    setIsLoading(() => true)
    debug('getting agent info....', agent.id)
    // get agent infro from api
    const result = await info(agent.id)
    
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
      onClickCapture={() => onClick && onClick(agent)}
    >
      <div className={`mask mask-squircle`}>
        {!onClick && link && agent ? <a href={`/agent/${user.slug}`}>{content}</a> : content}
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
                <Link href={`/agent/${user.slug}`}><h3 className="font-semibold">{userInfo?.name}</h3></Link>
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

export default EditorAvatar
