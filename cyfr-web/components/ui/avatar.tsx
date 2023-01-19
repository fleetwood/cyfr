import { User } from ".prisma/client"
import Link from "next/link"
import React from "react"

type AvatarProps = {
  user: User
  sz?: "wee" | "sm" | "md" | "lg"
  link?: boolean
}

const Avatar = ({ user: { id, image }, sz = "md", link = true }: AvatarProps) => {
  const size = sz == "lg" ? 32 : sz == "md" ? 24 : sz === "wee" ? 6 : 12
  return (
    <div className="avatar">
      <div className={`w-${size} h-${size} mask mask-squircle`}>
        {link ?
        <Link href={`/user/${id}`}>
          <img src={image!} />
        </Link>
        : <img src={image!} />
        }
      </div>
    </div>
  )
}

export default Avatar
