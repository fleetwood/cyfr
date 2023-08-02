import { Avatar, Badge } from "@mui/material"
import useDebug from "hooks/useDebug"
import {
  CyfrUser,
  MembershipType,
  User,
  UserDetail,
  UserFeed,
  UserFollow,
  UserStub
} from "prisma/prismaContext"
import { useState } from "react"
import { SizeProps, wh } from "types/props"
import { cloudinary } from "utils/cloudinary"
import UserInfoMenu from "./userInfoMenu"
import Semibold from "../semibold"

const {debug, jsonBlock} = useDebug('avatar')

export type AvatarUser = CyfrUser | UserDetail | UserFeed | UserStub | UserFollow | User

type AvatarProps = {
  user?: AvatarUser
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
  variant?: AvatarVariants[]
  sz: SizeProps
  onClick?: (user:AvatarUser) => void
}

export type AvatarVariants = 'default'|'no-profile'

const UserAvatar = ({
  user,
  placeholder,
  className,
  shadow,
  sz,
  link = true,
  onClick,
  variant = ['default'],
}: AvatarProps) => {
  if (!user) return <></>
  
  const [showProfile, setShowProfile] = useState(false)
  
  const stringToColour = (str: string) => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour
  }

  const s = wh(sz)

  const initials = (str:string) => str.split(/[^a-z0-9]/gmi).map(s => s.substring(0,1).toUpperCase()).join('').substring(0,2)

  const allowProfile = variant.indexOf('no-profile')<0

  const content = (
    <Badge overlap="circular" variant="dot"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
      {user.image ?
        <Avatar alt={user.name!} src={cloudinary.avatar(user.image, sz as unknown as SizeProps)} sx={{ width: s, height: s}} />
        :
        <Avatar alt={user.name!} sx={{bgcolor: stringToColour(user.name!), width: s, height: s}} >
          <Semibold>{initials(user.name!)}</Semibold>
        </Avatar>
      }
    </Badge>)

  return (
    <div 
      onMouseOverCapture={() => setShowProfile(() => allowProfile)}
      onMouseOutCapture={() => setShowProfile(() => false)}
      onClickCapture={() => onClick && onClick(user)}
    >
      {!onClick && link && user ? <a href={`/user/${user.slug}`}>{content}</a> : content}
      {allowProfile && 
        <UserInfoMenu user={user} showProfile={showProfile} setShowProfile={setShowProfile} />
      }
    </div>
  )
}

export default UserAvatar
