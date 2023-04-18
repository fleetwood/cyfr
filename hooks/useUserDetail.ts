import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getApi, sendApi } from "../utils/api"
import { UserFollowProps } from "../prisma/types/follow.def"
import { UserDetail } from "../prisma/prismaContext"
import useDebug from "./useDebug"
const {debug, info} = useDebug('useUserDetails')

export const userDetailQuery = "userDetailQuery"

async function getUser(userid:String) {
  const data = await getApi(`user/${userid}`)
  if (data.result) {
    const user = data.result
    return user
  }
  return null
}

export type UserDetailHookProps = {
  user?:  UserDetail
  id?: String
}

const useUserDetail = ({user, id}:UserDetailHookProps) => {
  const [currentUser, setCurrentUser] = useState<UserDetail>()
  const qc = useQueryClient()
  
  const userId = user?.id||id
  const queryTag = `userQuery.${userId}`

  const followers = currentUser?.followers || []
  const fans = followers.filter(f => f.isFan)
  const follows = currentUser?.follows || []
  const stans = follows.filter(f => f.isFan)
  

  const query = useQuery(
    [queryTag],
    () => getUser(userId!),
    {
      onSettled(data,error) {
        if (error || data === null) {
          info(`onSettled(${queryTag}) ERROR`,{ error, data })
        }
        if (data) {
          debug(`onSettled() success`)
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

  const followUser = async (props:UserFollowProps) => await send(`user/follow`, props)
  
  const stanUser = async (props:UserFollowProps) => await send(`user/follow`, {...props, isFan: true})

  const invalidateUser = () => {
    const queryKey = queryTag
    const q = {queryKey}
    debug('invalidateUser',{queryTag, queryKey, q})
    return qc.invalidateQueries(q)
  }
  
  return {currentUser, fans, followers, follows, stans, followUser, stanUser, invalidateUser}
}

export default useUserDetail
