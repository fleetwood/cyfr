import useCyfrUser from "hooks/useCyfrUser"
import useDebug from "hooks/useDebug"
import { CyfrUser } from "prisma/prismaContext"
import { sendApi } from "utils/api"

const {debug, info, fileMethod} = useDebug('/prisma/hooks/useCyfrUserApi', 'DEBUG')

export const useCyfrUserApi = () => {
    const [cyfrUser, isLoading, error, invalidate] = useCyfrUser()
    
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
  
    return { invalidate, updateUser }
  }
  