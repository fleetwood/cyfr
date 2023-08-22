import {UserStub} from 'prisma/types'
import UserAvatar from '../../ui/avatar/userAvatar'

type UserDetailFansProps = {
    fan: UserStub
}

const UserDetailFan = ({fan, ...props}:UserDetailFansProps) => <UserAvatar user={fan} sz='md' />

export default UserDetailFan