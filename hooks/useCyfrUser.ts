import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { AudienceType, CyfrUser, GetAudienceLevel, User, UserDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"

import useDebug from "./useDebug"
const {debug, info} = useDebug("useCyfrUser")

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
    return me.result || me.error || null
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

  const query = useQuery([cyfrUserQuery], getCyfrUser, {onSettled})

  return [query.data, query.status === "loading", query.error]
}

export const useCyfrUserApi = () => {
  const qc = useQueryClient()
  const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])

  type updateUserType = {
    data: User | CyfrUser | UserDetail
  }
  
  const updateUser = async ({data}:updateUserType) => {
    try {
      const {id, name, image} = data
      const update = await sendApi('/user/preferences', {id,name,image})
      if (update) {
        invalidateUser()
      }
      else {
        throw ({code: 'useCyfrUserApi/updateUser', message: 'That dint work'})
      }
    } catch (error) {
      info(`updateUser ERROR`,error)
    }
  }

  const getMentions = async (search?:string):Promise<{result:User[]}> => {
    const results = await getApi(`user/mentions?search=${search}`)
    return {...results} || []
  }

  return { invalidateUser, updateUser, getMentions }
}

export default useCyfrUser
