import { User } from '@prisma/client'
import Avatar from '../../ui/avatar'
import { uuid } from '../../../utils/helpers'

type UserDetailFansProps = {
    fan: User,
    key?: string
}

const UserDetailFan = ({fan, ...props}:UserDetailFansProps) => {
    return (
    <div key={uuid(props.key)}>
        <Avatar user={fan} sz='md' />
    </div>
)}

export default UserDetailFan