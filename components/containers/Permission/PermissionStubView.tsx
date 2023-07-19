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
        <Permission label='Agent' roles={permission.agent} />
        <Permission label='Artist' roles={permission.artist} />
        <Permission label='Author' roles={permission.author} />
        <Permission label='Editor' roles={permission.editor} />
        <Permission label='Member' roles={permission.member} />
        <Permission label='Public' roles={permission.public} />
        <Permission label='Reader' roles={permission.reader} />
    </Grid>
  )
}

export default PermissionStubView