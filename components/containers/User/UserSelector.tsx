import { User } from '@prisma/client'
import { TailwindInput } from 'components/forms'
import React, { useState } from 'react'
import { TailwindFormProps } from 'types/props'

type UserSelectorProps = {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
}

const UserSelector = (props:UserSelectorProps) => {
    const [users, setUsers] = useState<User[]>([])

    const userLabel = users?.map((u:User) => u.name).join(',')

  return (
    <TailwindInput type='text' label={props.label} value={userLabel} setValue={() => {}} />
  )
}

export default UserSelector