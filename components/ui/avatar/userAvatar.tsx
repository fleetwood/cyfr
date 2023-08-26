import {Avatar, Badge} from "@mui/material"
import useDebug from "hooks/useDebug"
import {
  CyfrUser,
  UserDetail,
  UserFeed,
  UserFollow,
  UserSearchStub,
  UserStub,
  UserTypes
} from "prisma/prismaContext"
import {useState} from "react"
import {SizeProps, stringToColour, wh} from "types/props"
import {cloudinary} from "utils/cloudinary"
import Semibold from "../semibold"
import UserInfoMenu from "./userInfoMenu"
import {GetUserType} from "utils/helpers/user"

const {debug, jsonBlock} = useDebug('avatar')

export type AvatarUser = CyfrUser | UserDetail | UserFeed | UserStub | UserFollow | UserSearchStub

export type AvatarProps = {
  user?: AvatarUser
  userType?: UserTypes
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
  variant?: AvatarVariants[]
  sz: SizeProps
  onClick?: (user:AvatarUser) => void
}

export type AvatarVariants = 'default'|'no-profile'|'no-link'

const UserAvatar = ({
  user,
  userType,
  placeholder,
  className,
  shadow,
  sz,
  onClick,
  variant = ['default'],
}: AvatarProps) => {
  if (!user) return <></>
  
  const [showProfile, setShowProfile] = useState(false)
  
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
      {!onClick && variant.indexOf('no-link')<0 && user ? <a href={`/user/${user.slug}`}>{content}</a> : content}
      {allowProfile && 
        <UserInfoMenu user={user} showProfile={showProfile} setShowProfile={setShowProfile} userType={GetUserType(user as UserStub)} />
      }
    </div>
  )
}

export default UserAvatar
