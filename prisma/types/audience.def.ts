import useDebug from "../../hooks/useDebug"
import { CyfrUser, User } from "../prismaContext"

const { debug } = useDebug("audience.def.ts", 'DEBUG')

export const AudienceType = {
  PUBLIC:     "PUBLIC",
  USER:       "USER",
  READER:     "READER",
  MEMBER:     "MEMBER",
  MEMBER_EXP: "MEMBER_EXP",
  AGENT:      "AGENT",
  AGENT_EXP:  "AGENT_EXP",
  ADMIN:      "ADMIN",
  OWNER:      "OWNER",
}

export const GetAudienceLevel = (type: string) => {
  switch (type.toUpperCase()) {
    case AudienceType.USER:
    case AudienceType.READER:
      return 100
    case AudienceType.MEMBER_EXP:
      return 200
    case AudienceType.MEMBER:
      return 210
    case AudienceType.AGENT_EXP:
      return 300
    case AudienceType.AGENT:
      return 310
    case AudienceType.ADMIN:
      return 900
    case AudienceType.OWNER:
      return 1000
    case AudienceType.PUBLIC:
      return 0
  }
  debug("GetAudienceLevel type not detected", { type })
  return 0
}

/**
 * see AudienceType enum
 */
export type AccessProps = {
    required: "public" | "reader" | "user" | "member" | "member_exp" | "agent" | "agent_exp" | "admin" | "owner",
    user?: User
    cyfrUser?: CyfrUser
}

export const canAccess = ({required,user,cyfrUser}:AccessProps) => {
    const allow = GetAudienceLevel(
        // cyfrUser or user membership level, in all cases default to public if none found
        cyfrUser ? cyfrUser.membership?.level || AudienceType.PUBLIC
        : user ? AudienceType.USER || AudienceType.PUBLIC
        : AudienceType.PUBLIC
    ) >= GetAudienceLevel(required)
    debug(`canAccess`, {required, user, cyfrUser, allow})
    return allow
}