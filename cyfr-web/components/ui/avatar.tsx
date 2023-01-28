import { User } from ".prisma/client"
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary"

type AvatarProps = AvatarSizeProps & {
  user?: User
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
}

const sizes = {
  xs: 20,
  sm: 40,
  md: 80,
  lg: 120,
  xl: 160
}

const Avatar = ({
  user,
  placeholder,
  className,
  shadow,
  sz,
  link = true,
}: AvatarProps) => {
  const size = `w-[${sizes[sz]}px]`
  const content = user && user.image 
    ? <img className={size} width={sizes[sz]} src={cloudinary.avatar(user.image, sz as unknown as AvatarSizeProps)}/> 
    : placeholder ? placeholder : '?'
  return (
    <div className={`avatar`}>
      <div className={`mask mask-squircle`}>
        {link && user ? (
          <a href={`/user/${user.id}`}>
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  )
}

export default Avatar
