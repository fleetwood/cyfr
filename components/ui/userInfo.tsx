import React from 'react'
import { CyfrUser, UserStub, v_author_stub } from '../../prisma/prismaContext'
import UserAvatar from './avatar/userAvatar'
import { uniqueKey, uuid } from '../../utils/helpers'
import { SizeProps } from 'types/props'

export type UserInfoProps = {
    user: CyfrUser|UserStub|v_author_stub
    link?: boolean
    variant?: 'dark'
    sz: SizeProps
}

const UserInfo = ({user,link,sz,variant}:UserInfoProps) => {
    const popover = uniqueKey(user)+uuid()
    const count = (prop:any[]|number):number => Array.isArray(prop) ? prop.length : prop
  return (
    <div>
        <UserAvatar user={user} link={link} sz={sz} />
        
    </div>
  )
}

export default UserInfo