import { UserFollows } from '../../../prisma/types/user'
import Avatar from '../../ui/avatar'

type UserDetailFollowsProps = {
    following?: UserFollows
    follower?: UserFollows
}

const UserDetailFollow = ({following, follower}:UserDetailFollowsProps) => (
    <div>
        {following && <Avatar user={following.following} />}
        {follower && <Avatar user={follower.follower} />}
    </div>
)

export default UserDetailFollow