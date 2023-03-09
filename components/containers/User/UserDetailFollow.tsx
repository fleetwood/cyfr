import { Follow } from '@prisma/client'
import Avatar from '../../ui/avatar'

type UserDetailFollowsProps = {
    following?: Follow
    follower?: Follow
}

const UserDetailFollow = ({following, follower}:UserDetailFollowsProps) => (
    <div>
        {following && 
            // <Avatar user={following.following} sz='md' />
            <>{following.followingId}</>
        }
        {follower && 
            // <Avatar user={follower.follower} sz='md' />
            <>{follower.followerId}</>
        }
    </div>
)

export default UserDetailFollow