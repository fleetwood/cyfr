import React from 'react'
import { UserFollows } from '../../../prisma/users'
import Avatar from '../../ui/avatar'
import JsonBlock from '../../ui/jsonBlock'

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