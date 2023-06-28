import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { AudienceLevels } from 'prisma/prismaContext'

/**
 * 
 * @param required The level of membership required to view this content.
 * @returns 
 */
export const useAudience = ({required='PUBLIC'}:{required: AudienceLevels}) => {
  const [cyfrUser]  = useCyfrUserContext()
  const level = cyfrUser?.membership?.type.level ?? 'PUBLIC'

  const hasAccess = level >= required
  const canAccess = (require:AudienceLevels) => level >= require
  
  return {
    level,
    hasAccess,
    canAccess
  }
}
