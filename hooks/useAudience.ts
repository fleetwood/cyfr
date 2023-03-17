import { useState } from "react"
import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import { AudienceType, canAccess, GetAudienceLevel } from "../prisma/prismaContext"

/**
 * 
 * @param required The level of membership required to view this content.
 * @returns 
 */
export const useAudience = (required?:'public'|'user'|'member'|'member_exp'|'agent'|'agent_exp') => {
  const [level, setLevel] = useState<string>(required || AudienceType.PUBLIC)
  const [value, setValue] = useState<number>(GetAudienceLevel(AudienceType.PUBLIC))
  const [cyfrUser]  = useCyfrUserContext()
  
  const CanAccess = (required:'public'|'user'|'member'|'member_exp'|'agent'|'agent_exp') => canAccess({required, cyfrUser})
  
  return {
    level, setLevel,
    value, setValue,
    CanAccess
  }
}
