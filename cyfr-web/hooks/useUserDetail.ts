import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { GetResponseError, ResponseError } from "../types/response"
import { getApi, sendApi } from "../utils/api"
import { FanProps, FollowProps, UserDetail } from "../prisma/types/user.def"
import { log } from "../utils/log"

export const userDetailQuery = "userDetailQuery"

async function getUser(userid:string) {
  const data = await getApi(`user/byId/${userid}`)
  if (data.result) {
    const user = data.result
    return user
  }
  return null
}

const useUserDetail = (id:string) => {
  const [currentUser, setCurrentUser] = useState<UserDetail>()
  const qc = useQueryClient()

  const queryTag = `userQuery.${id}`

  const query = useQuery(
    [queryTag],
    () => getUser(id),
    {
      onSettled(data,error) {
        if (error || data === null) {
          log(
            `\tuseUserDetail.onSettled(${queryTag}) ERROR ${JSON.stringify({ error, data })}`
          )
        }
        if (data) {
          log(`useUserDetail.onSettled() success`)
          setCurrentUser(() => data as UserDetail)
        }
      }
    }
  )

  const send = async (url:string, props:unknown) => {
    const res = await sendApi(url, props)
    if (res) {
      invalidateUser()
      return res
    }
    return null
  }

  const follow = async (props:FollowProps) => await send(`user/follow`, props)
  
  const stan = async (props:FanProps) => await send(`user/stan`, props)

  const invalidateUser = () => {
    log(`useUserDetail.invalidateUser(${queryTag})`)
    return qc.invalidateQueries([queryTag])
  }
  
  return {currentUser, follow, stan, invalidateUser}
}

export default useUserDetail
