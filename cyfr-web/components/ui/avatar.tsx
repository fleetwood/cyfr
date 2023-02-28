import { UserDetail, UserFeed, Audience, CyfrUser, User } from "../../prisma/types"
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary"

type AvatarProps = AvatarSizeProps & {
  user?: CyfrUser | UserDetail | UserFeed | User
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
}

const Avatar = ({user,placeholder,className,shadow,sz,link = true}: AvatarProps) => {
  const content = user && user.image 
    ? <img src={cloudinary.avatar(user.image, sz as unknown as AvatarSizeProps)}/> 
    : placeholder ? placeholder : '?'

    // @ts-ignore
    const online = user && user._count && user._count.sessions && user._count.sessions > 0 ? 'online' : ''
    // @ts-ignore User will not have membership, but that's ok, we've accounted for that here
    const member = user?.membership?.level === Audience.MEMBER ? 'member' : user?.membership?.level === Audience.AGENT ? 'agent' : ''
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
