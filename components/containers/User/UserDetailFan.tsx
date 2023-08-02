import { User } from '@prisma/client'
import UserAvatar from '../../ui/avatar/userAvatar'
import { uuid } from '../../../utils/helpers'

type UserDetailFansProps = {
    fan: User,
    key?: string
}

const UserDetailFan = ({fan, ...props}:UserDetailFansProps) => {
    return (
    <div key={uuid(props.key)}>
        <UserAvatar user={fan} sz='md' />
    </div>
)}

export default UserDetailFan