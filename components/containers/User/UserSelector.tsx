import { User, UserStub, } from 'prisma/prismaContext'
import { TailwindInput } from 'components/forms'
import React, { useEffect, useState } from 'react'
import { TailwindFormProps } from 'types/props'
import useDebounce from 'hooks/useDebounce'
import useApi from 'prisma/useApi'
import { Grid } from '@mui/material'
import Avatar from 'components/ui/avatar'
import { uniqueKey } from 'utils/helpers'

type UserSelectorProps = {
    label:              string
    placeholder?:       string
    cardClassName?:     string
    labelClassName?:    string
    inputClassName?:    string
    required?:          boolean
}

const UserSelector = (props:UserSelectorProps) => {
  const {friends } = useApi.user()
  const {cyfrUser} = useApi.cyfrUser()
  const [users, setUsers] = useState<UserStub[]>([])
  
  const [search, setSearch] = useState<string|null>(null)
  const findUser = useDebounce({value: search, ms: 500})
  const findUsers = async () => {
      const f = await friends(cyfrUser.id, search??undefined)
      if (f) {
        setUsers(() => f)
      }
  }
  useEffect(() => {findUsers()}, [findUser])

  return (
    <>
      <TailwindInput type='text' label={props.label} value={search} setValue={setSearch} />
      <Grid>
        {users.map((u:UserStub) => <Avatar user={u} sz='sm' key={uniqueKey(u.id)} />)}
      </Grid>
    </>
    // <TailwindInput type='text' label={props.label} value={users.map((u:UserStub) => u.name).join('@')} setValue={() => {}} />
  )
}

export default UserSelector