import { Dispatch, SetStateAction, useState } from "react"
import { UseQueryResult, useQuery, useQueryClient } from "react-query"
import { ResponseError } from "../types/response"
import { getApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"
import { UserWithPostsLikes } from "../prisma/types/user"
import { log } from "../utils/log"
import { uuid } from "../utils/helpers"

const cyfrUserQuery = "cyfrUserQuery"

export async function getCyfrUser() {
  log(`useCyfrUser.getCyfrUser()`)
  const data = await getApi(`/me`)
  if (data) {
    log(`useCyfrUser.getCyfrUser result(${JSON.stringify(data)})`)
    const cyfrUser = data as UserWithPostsLikes
    return cyfrUser
  }
  return null
}

export type useCyfrUserHookType = {
  data?: UserWithPostsLikes
  isLoading: boolean
  error: unknown
}[]

const useCyfrUser = ():[UserWithPostsLikes,boolean,unknown] => {
  const qc = useQueryClient()
  const [refetchInterval, setRefetchInterval] = useState(__cyfr_refetch__)

  const getCyfrUser = async () => {
    const me = await getApi("/me")
    setRefetchInterval((c) => (me ? __cyfr_refetch__ : 1000))
    return me.result || me.error || null
  }

  const query = useQuery([cyfrUserQuery], getCyfrUser, {
    onSettled(data, error) {
      if (error || data.error) {
        log(
          `\tuseCyfrUser.onSettled() ERROR ${JSON.stringify({ error, data })}`
        )
      }
      if (data.result) {
        log(`useCyfrUser.onSettled() success`)
        return data.result as UserWithPostsLikes
      }
    },
    refetchInterval
  })

  return [query.data, query.status === "loading", query.error]
}

export const useCyfrUserApi = () => {
  const qc = useQueryClient()
  const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])
  return { invalidateUser }
}

export default useCyfrUser
