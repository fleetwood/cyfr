import { useState } from "react"
import { AudienceType, canAccess, GetAudienceLevel } from "../prisma/prismaContext"
import useCyfrUser from "./useCyfrUser"

export const useAudience = (required?:'public'|'user'|'member'|'member_exp'|'agent'|'agent_exp') => {
  const [level, setLevel] = useState<string>(required || AudienceType.PUBLIC)
  const [value, setValue] = useState<number>(GetAudienceLevel(AudienceType.PUBLIC))
  const [cyfrUser]  = useCyfrUser()
  
  const CanAccess = (required:'public'|'user'|'member'|'member_exp'|'agent'|'agent_exp') => canAccess({required, cyfrUser})
  
  return {
    level, setLevel,
    value, setValue,
    CanAccess
  }
}
