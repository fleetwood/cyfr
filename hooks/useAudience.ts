import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import { Audience } from './../prisma/prismaContext'

/**
 * This should be the same as the enum for {@link Audience}
 * Ya it's a dumb hack, hello.
 * 
 * @property PUBLIC Default for all users, including those who have no membership, or are not logged in
 * @property USER This is for a logged-in user who has not yet selected a membership
 * @property READER A free membership that does not confer any MEMBER rights
 * @property MEMBER_EXP A logged-in MEMBER whose membership is expired
 * @property MEMBER A logged-in Member
 * @property AGENT_EXP A logged-in AGENT whose membership is expired
 * @property AGENT A logged-in Agent
 * @property ADMIN A logged-in Admin, special login that confers all other rights
 * @property OWNER That would be me. The alpha and omega, scene-stealer mean godzilla an th' pillar.
 */
export enum AudienceLevels {
  PUBLIC = 0,
  USER = 100,
  READER = 110,
  MEMBER_EXP = 200,
  MEMBER = 210,
  AGENT_EXP = 300,
  AGENT = 310,
  ADMIN = 400,
  OWNER = 1000
}

/**
 * 
 * @param required The level of membership required to view this content.
 * @returns 
 */
export const useAudience = (required=AudienceLevels.PUBLIC) => {
  const [cyfrUser]  = useCyfrUserContext()
  const level = AudienceLevels[(cyfrUser && cyfrUser.membership?.level 
    ? cyfrUser.membership?.level
    : AudienceLevels.PUBLIC)]

  const hasAccess = level >= required
  const canAccess = (require:AudienceLevels) => level >= require
  
  return {
    level,
    hasAccess,
    canAccess
  }
}
