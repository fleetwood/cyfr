import { Fan } from '@prisma/client'
import React from 'react'
import JsonBlock from '../../ui/jsonBlock'

type UserDetailFansProps = {
    fan: Fan
}

const UserDetailFan = ({fan}:UserDetailFansProps) => {
    return (
    <div>
        <JsonBlock data={fan} />
    </div>
)}

export default UserDetailFan