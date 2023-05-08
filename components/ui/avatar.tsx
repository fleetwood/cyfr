import { UserDetail, UserFeed, User, CyfrUser, UserStub } from "../../prisma/prismaContext"
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary"

type AvatarProps = {
  user?:        CyfrUser | UserDetail | UserFeed | User | UserStub
  link?:        boolean
  shadow?:      boolean
  className?:   string
  placeholder?: string
  sz:           AvatarSizeProps
  popover?:     string
}

const Avatar = ({user,placeholder,className,shadow,popover, sz,link = true}: AvatarProps) => {
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
      <div className={`mask mask-squircle`} data-popover-target={popover??null}>

        {link && user 
        ? (<a href={`/user/${user.name}`}>{content}</a>) 
        : (content)
        }
      </div>
    </div>
  )
}

export default Avatar
