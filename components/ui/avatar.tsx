import { UserDetail, UserFeed, User, CyfrUser, UserProps } from "../../prisma/prismaContext"
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary"

type AvatarProps = AvatarSizeProps & {
  user?: CyfrUser | UserDetail | UserFeed | User | UserProps
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
}

const Avatar = ({user,placeholder,className,shadow,sz,link = true}: AvatarProps) => {
  const content = user && user.image 
    ? <img src={cloudinary.avatar(user.image, sz as unknown as AvatarSizeProps)}/> : 
    placeholder ? placeholder : 
    user ? user.name :
    '?'

    // @ts-ignore
    const online = user && user._count && user._count.sessions && user._count.sessions > 0 ? 'online' : ''
    // @ts-ignore
    const member = user?.membership?.level.toLowerCase() || ''
  return (
    <div className={`avatar ${online} ${member}`}>
      <div className={`mask mask-squircle`}>

        {link && user 
        ? (<a href={`/user/${user.id}`}>{content}</a>) 
        : (content)
        }
      </div>
    </div>
  )
}

export default Avatar
