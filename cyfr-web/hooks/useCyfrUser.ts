import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { CyfrUser, User, UserDetail } from "../prisma/prismaContext"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"
import { log } from "../utils/log"

const cyfrUserQuery = "cyfrUserQuery"

export async function getCyfrUser() {
  log(`useCyfrUser.getCyfrUser()`)
  const data = await getApi(`/me`)
  try {
    log(`useCyfrUser.getCyfrUser result(${JSON.stringify(data)})`)
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
    // log(`useCyfrUser.onSettled()`)
    if (error || data?.error || null) {
      log(
        `\tuseCyfrUser.onSettled() ERROR ${JSON.stringify({ error, data })}`
      )
      return null
    }
    if (data) {
      // log(`\tSUCCESS`)
      return data as CyfrUser
    }
  }

  const query = useQuery([cyfrUserQuery], getCyfrUser, {onSettled,refetchInterval})

  return [query.data, query.status === "loading", query.error]
}

export const useCyfrUserApi = () => {
  const qc = useQueryClient()
  const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])

  type updateUserType = {
    newUser: User | CyfrUser | UserDetail
  }
  
  const updateUser = async ({newUser}:updateUserType) => {
    try {
      const {id, name, image} = newUser
      const update = await sendApi('/user/preferences', {id,name,image})
      if (update) {
        invalidateUser()
      }
      else {
        throw ({code: 'useCyfrUserApi/updateUser', message: 'That dint work'})
      }
    } catch (error) {
      log(`useCyfrUser.updateUser ERROR ${JSON.stringify(error, null, 2)}`)
    }
  }

  return { invalidateUser, updateUser }
}

export default useCyfrUser
