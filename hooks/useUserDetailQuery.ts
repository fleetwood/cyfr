import { useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getApi, sendApi } from "utils/api"
import { UserDetail, UserDetailProps, UserFollowProps } from "prisma/prismaContext"
import useDebug from "./useDebug"
import UserApi from "prisma/hooks/userApi"
const {debug, info} = useDebug('useUserDetails')

const {detail} = UserApi()
export const userDetailQuery = "useUserDetailQuery"

const  getUser = async (userid:string) => await detail({id: userid})

export type UserDetailHookProps = UserDetailProps & {
  user?:  UserDetail
}

const useUserDetail = ({user, id, name, email, slug}:UserDetailHookProps) => {
  const [currentUser, setCurrentUser] = useState<UserDetail>()
  const qc = useQueryClient()
  
  const userId = user?.id||id
  const queryTag = `userQuery.${userId}`

  const followers = currentUser?.follower || []
  const fans = followers.filter(f => f.isFan)
  const follows = currentUser?.following || []
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
          setCurrentUser(() => data)
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
