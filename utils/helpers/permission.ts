import useDebug from "hooks/useDebug"
import { CyfrUser, PermissionStub, Role } from "prisma/prismaContext"

const {debug} = useDebug('utils/helpers/permission', 'DEBUG')

export const hasExactAccess = (user: CyfrUser,permission: PermissionStub,role: Role): boolean => {
    const authorAccess = user.userAuthor && permission.author.indexOf(role) >= 0
    const agentAccess = user.userAgent && permission.agent.indexOf(role) >= 0
    const artistAccess = user.userArtist && permission.artist.indexOf(role) >= 0
    const editorAccess = user.userEditor && permission.editor.indexOf(role) >= 0
    const readerAccess = user.userReader && permission.reader.indexOf(role) >= 0
    const memberAccess = permission.member.indexOf(role) >= 0
    const publicAccess = permission.public.indexOf(role) >= 0
    const result =authorAccess || agentAccess || artistAccess || editorAccess || readerAccess || memberAccess || publicAccess
  
    debug('hasExactAccess', {
      permission,
      role,
      authorAccess,
      agentAccess,
      artistAccess,
      editorAccess,
      readerAccess,
      memberAccess,
      publicAccess,
      result,
    })
    return result
  }
  