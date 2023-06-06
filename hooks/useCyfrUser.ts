import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { CyfrUser, User, UserDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"

import useDebug from "./useDebug"
const {debug, info, fileMethod} = useDebug("useCyfrUser")

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

const useCyfrUser = ():[
  data:       CyfrUser,
  isLoading:  boolean,
  error:      unknown,
  invalidate: () => Promise<void>
] => {
  const cyfrUserQuery = "cyfrUserQuery"
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

  const invalidate = async () => qc.invalidateQueries(cyfrUserQuery)
 
  const query = useQuery(cyfrUserQuery, getCyfrUser, {onSettled})

  return [query.data, query.status === "loading", query.error, invalidate]
}

export default useCyfrUser
