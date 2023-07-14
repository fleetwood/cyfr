import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import useDebug from "hooks/useDebug"
import { CyfrUser, Membership, MembershipType } from "prisma/prismaContext"
import { sendApi } from "utils/api"

const {debug, info, fileMethod} = useDebug('/prisma/hooks/useCyfrUserApi')

export type cadenceInterval = 'M' | 'y'
export type SetMembershipProps = {
  typeId:   string
  cadence:  cadenceInterval
}

type CyfrUserApi = {
    invalidate:     () => void
    updateUser:     (data: CyfrUser) => Promise<CyfrUser>
    setMembership:  (props:SetMembershipProps) => Promise<Membership>
    
    cyfrUser:   CyfrUser
    isLoading:  boolean
    error:      boolean
}

const useCyfrUserApi = ():CyfrUserApi => {
    const {data:cyfrUser, isLoading, error, invalidate} = useCyfrUserContext()
    
    /**
     * Provide the typeId and cadence in 
     * 
     * @param props {@link SetMembershipProps}
     * @returns 
     */
    const setMembership = async (props:SetMembershipProps):Promise<Membership> => await (await sendApi('user/membership/choose', props)).data as Membership

    // TODO: this needs a better name, because it's not updating preferences
    const updateUser = async (data:CyfrUser) => {
      debug('updateUser', data)
      try {
        const {id, name, image} = data
        const result = await (await sendApi('/user/preferences', {id,name,image})).data
        if (result) {
          debug('updateUser', {
            message: 'Success. This should be invalidating the user at this point.', 
            result
          })
          invalidate()
          return result
        }
        else {
          throw ({code: fileMethod('updateUser'), message: result.data.message})
        }
      } catch (error) {
        info(`updateUser ERROR`,error)
        return ({code: fileMethod('updateUser'), message: 'That dint work'})
      }
    }
  
    return { invalidate, updateUser, cyfrUser, isLoading, error, setMembership }
  }
  
  export default useCyfrUserApi