import { User } from ".prisma/client"

type AvatarProps = {
  user?: User
  sz?: "wee" | "sm" | "md" | "lg"
  link?: boolean
  shadow?: boolean
  className?: string
  placeholder?: string
}

const Avatar = ({
  user,
  placeholder,
  className,
  shadow,
  sz = "md",
  link = true,
}: AvatarProps) => {
  const size = sz == "lg" ? 48 : sz == "md" ? 24 : sz === "wee" ? 6 : 10
  const dropShadow = shadow ? (size >= 12 ? 'drop-shadow-lg' : 'drop-shadow-md') : ''
  const content = user && user.image ? <img src={user.image}/> : placeholder ? placeholder : '?'
  return (
    <div className={`avatar ${className || ''}`}>
      <div className={`w-${size} h-${size} ${dropShadow} mask mask-squircle`}>
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
