import {SizeProps} from 'types/props'
import {UserStub} from 'prisma/prismaContext'
import {uniqueKey,uuid} from 'utils/helpers'
import UserAvatar from './avatar/userAvatar'

export type UserInfoProps = {
    user: UserStub
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