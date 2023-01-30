import { UserFollows } from '../../../prisma/types/user.def'
import Avatar from '../../ui/avatar'

type UserDetailFollowsProps = {
    following?: UserFollows
    follower?: UserFollows
}

const UserDetailFollow = ({following, follower}:UserDetailFollowsProps) => (
    <div>
        {following && <Avatar user={following.following} sz='md' />}
        {follower && <Avatar user={follower.follower} sz='md' />}
    </div>
)

export default UserDetailFollow