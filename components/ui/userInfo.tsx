import React from 'react'
import { CyfrUser, UserStub, v_author_stub } from '../../prisma/prismaContext'
import Avatar from './avatar'
import { domRef, uuid } from '../../utils/helpers'
import { AvatarSizeProps } from '../../utils/cloudinary'

export type UserInfoProps = {
    user: CyfrUser|UserStub|v_author_stub
    link?: boolean
    variant?: 'dark'
    sz: AvatarSizeProps
}

const UserInfo = ({user,link,sz,variant}:UserInfoProps) => {
    const popover = domRef(user)+uuid()
    const count = (prop:any[]|number):number => Array.isArray(prop) ? prop.length : prop
  return (
    <div>
        <Avatar user={user} link={link} sz={sz} />
        
    </div>
  )
}

export default UserInfo