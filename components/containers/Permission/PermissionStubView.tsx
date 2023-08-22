import React from 'react'
import { Permission, Role } from 'prisma/prismaContext'
import Grid from '@mui/material/Grid'

const Permission = ({label, roles}: {label:string, roles?:Role[]}) => 
  <Grid sm>
    <div className={`text-center p-1 items-center`}>{label}</div>
    <div className={`text-center p-1 items-center`}>{(roles??[]).flatMap((r:Role) => r).join(', ')}</div>
  </Grid>


const PermissionStubView = ({className, permission}:{className?: string, permission:Permission}) => {
  return (
    <Grid container spacing={2} className={className}>
        <Permission label='Public' roles={permission.public} />
        <Permission label='Member' roles={permission.member} />
        <Permission label='Agent' roles={permission.agent} />
        <Permission label='Follower' roles={permission.follower} />
        <Permission label='Fan' roles={permission.fan} />
        <Permission label='Friend' roles={permission.friend} />
    </Grid>
  )
}

export default PermissionStubView