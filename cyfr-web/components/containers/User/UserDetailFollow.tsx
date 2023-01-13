import { Follow } from '@prisma/client'
import React from 'react'
import JsonBlock from '../../ui/jsonBlock'

type UserDetailFollowsProps = {
    follow: Follow
}

const UserDetailFollow = ({follow}:UserDetailFollowsProps) => {
    return (
    <div>
        <JsonBlock data={follow} />
    </div>
)}

export default UserDetailFollow