import { UserFollow } from '../../../prisma/prismaContext'
import { todo } from '../../../utils/log'
import Avatar from '../../ui/avatar'

type UserDetailFollowsProps = {user:UserFollow}

const UserDetailFollow = ({user}:UserDetailFollowsProps) =>{
    todo('UserDetailFollow is probably not necessary anymore....')
    return (
    <div>
        <Avatar user={user} sz='md' />
    </div>
)}

export default UserDetailFollow