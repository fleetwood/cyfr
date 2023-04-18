import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { CyfrUser, User, UserDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"

import useDebug from "./useDebug"
const {debug, info, fileMethod} = useDebug("useCyfrUser")

const cyfrUserQuery = "cyfrUserQuery"

export async function getCyfrUser() {
  debug(`getCyfrUser`)
  const data = await getApi(`/me`)
  try {
    debug(`getCyfrUser result`,data)
    const cyfrUser = data as CyfrUser
    return cyfrUser
  } catch (error) {
    return null
  }
}

export type useCyfrUserProps = {
  data?: CyfrUser
  isLoading: boolean
  error: unknown
}[]

const useCyfrUser = ():[CyfrUser,boolean,unknown] => {
  const qc = useQueryClient()
  const [refetchInterval, setRefetchInterval] = useState(__cyfr_refetch__)

  const getCyfrUser = async () => {
    const me = await getApi("/me")
    setRefetchInterval((c) => (me ? __cyfr_refetch__ : 1000))
    return me.result as CyfrUser || me.error || null
  }

  // @ts-ignore
  const onSettled = (data, error) => {
    // debug(`useCyfrUser.onSettled()`)
    if (error || data?.error || null) {
      info(`onSettled ERROR`,{ error, data })
      return null
    }
    if (data) {
      debug(`onSettled SUCCESS`)
      return data as CyfrUser
    }
  }

  const query = useQuery(cyfrUserQuery, getCyfrUser, {onSettled})

  return [query.data, query.status === "loading", query.error]
}

export const useCyfrUserApi = () => {
  const qc = useQueryClient()
  const invalidateUser = () => {
    debug('invalidateUser')
    qc.invalidateQueries([cyfrUserQuery])
  }
  
  const updateUser = async (data:CyfrUser) => {
    debug('updateUser', data)
    try {
      const {id, name, image} = data
      const result = await sendApi('/user/preferences', {id,name,image})
      if (result.status === 200) {
        const data = result.data
        debug('updateUser', {message: 'Success. This should be invalidating the user at this point.', result: {...data.id, ...data.name, ...data.image}})
        invalidateUser()
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

  return { invalidateUser, updateUser }
}

export default useCyfrUser
