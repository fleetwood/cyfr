import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import { Audience } from './../prisma/prismaContext'

/**
 * 
 * @param required The level of membership required to view this content.
 * @returns 
 */
export const useAudience = ({required=Audience.PUBLIC}:{required: Audience}) => {
  const [cyfrUser]  = useCyfrUserContext()
  const level = cyfrUser?.membership?.level ?? Audience.PUBLIC

  const hasAccess = level >= required
  const canAccess = (require:Audience) => level >= require
  
  return {
    level,
    hasAccess,
    canAccess
  }
}
