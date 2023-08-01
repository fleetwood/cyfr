import useDebug from "hooks/useDebug"
import { CyfrUser, PermissionStub, Role } from "prisma/prismaContext"

const {debug} = useDebug('utils/helpers/permission', )

export const hasExactAccess = (user: CyfrUser,permission: PermissionStub,role: Role): boolean => {
    const agentAccess = user.userAgent && permission.agent.indexOf(role) >= 0
    const memberAccess = permission.member.indexOf(role) >= 0
    const fanAccess = permission.fan.indexOf(role) >= 0
    const followerAccess = permission.follower.indexOf(role) >= 0
    const friendAccess = permission.friend.indexOf(role) >= 0
    const publicAccess = permission.public.indexOf(role) >= 0
    const result = publicAccess ||memberAccess || agentAccess || fanAccess || followerAccess || friendAccess
  
    debug('hasExactAccess', {
      permission,
      role
      , publicAccess
      , memberAccess 
      , agentAccess 
      , fanAccess 
      , followerAccess 
      , friendAccess
      , result
    })
    return result
  }
  