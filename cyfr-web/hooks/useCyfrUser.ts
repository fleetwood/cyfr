import { Dispatch, SetStateAction, useState } from "react"
import { UseQueryResult, useQuery, useQueryClient } from "react-query"
import { ResponseError } from "../types/response"
import { getApi, sendApi } from "../utils/api"
import { __cyfr_refetch__ } from "../utils/constants"
import { UserDetail, UserWithPostsLikes } from "../prisma/types/user"
import { jsonify, log } from "../utils/log"
import { uuid } from "../utils/helpers"
import { User } from "@prisma/client"
import useUserDetail from "./useUserDetail"
import { cloudinary } from "../utils/cloudinary"

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

export type useCyfrUserProps = {
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

  // @ts-ignore
  const onSettled = (data, error) => {
    // log(`useCyfrUser.onSettled()`)
    if (error || data.error) {
      log(
        `\tuseCyfrUser.onSettled() ERROR ${JSON.stringify({ error, data })}`
      )
    }
    if (data) {
      // log(`\tSUCCESS`)
      return data as UserWithPostsLikes
    }
  }

  const query = useQuery([cyfrUserQuery], getCyfrUser, {onSettled,refetchInterval})

  return [query.data, query.status === "loading", query.error]
}

export const useCyfrUserApi = () => {
  const qc = useQueryClient()
  const invalidateUser = () => qc.invalidateQueries([cyfrUserQuery])

  type updateUserType = {
    newUser: User | UserWithPostsLikes | UserDetail
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
