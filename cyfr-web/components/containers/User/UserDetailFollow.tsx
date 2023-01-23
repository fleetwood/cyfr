import React from 'react'
import Avatar from '../../ui/avatar'
import { UserFollows } from '../../../prisma/types/user'

type UserDetailFollowsProps = {
    following?: UserFollows
    follower?: UserFollows
}

const UserDetailFollow = ({following, follower}:UserDetailFollowsProps) => {
    return (
    <div>
        {following && <Avatar user={following.following} />}
        {follower && <Avatar user={follower.follower} />}
    </div>
)}

export default UserDetailFollow