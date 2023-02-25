import useDebug from "../../hooks/useDebug"
import { CyfrUser, User } from "../prismaContext"

const { debug } = useDebug({ fileName: "audience.def.ts", level: "DEBUG" })

export const AudienceType = {
  PUBLIC: "public",
  USER: "user",
  MEMBER: "member",
  MEMBER_EXP: "member_exp",
  AGENT: "agent",
  AGENT_EXP: "agent_exp",
}

export const GetAudienceLevel = (type: string) => {
  switch (type) {
    case AudienceType.USER:
      return 100
    case AudienceType.MEMBER_EXP:
      return 200
    case AudienceType.MEMBER:
      return 210
    case AudienceType.AGENT_EXP:
      return 300
    case AudienceType.AGENT:
      return 310
    case AudienceType.PUBLIC:
      return 0
  }
  debug("GetAudienceLevel type not detected", { type })
  return 0
}

export type AccessProps = {
    required: "public" | "user" | "member" | "member_exp" | "agent" | "agent_exp",
    user?: User
    cyfrUser?: CyfrUser
}
export const canAccess = ({required,user,cyfrUser}:AccessProps) => 
    GetAudienceLevel(
        cyfrUser ? cyfrUser.membership?.level || AudienceType.PUBLIC
        : user ? AudienceType.USER || AudienceType.PUBLIC
        : AudienceType.PUBLIC
    ) >= GetAudienceLevel(required)
