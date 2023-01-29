import { User } from ".prisma/client"
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary"

type AvatarProps = AvatarSizeProps & {
  user?: User
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
}

const Avatar = ({user,placeholder,className,shadow,sz,link = true}: AvatarProps) => {
  const content = user && user.image 
    ? <img src={cloudinary.avatar(user.image, sz as unknown as AvatarSizeProps)}/> 
    : placeholder ? placeholder : '?'

  return (
    <div className={`avatar`}>
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
