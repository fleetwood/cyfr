import useDebug from "../../hooks/useDebug"
import { getApi, sendApi } from "../../utils/api"
import { UserEngageProps, UserFollowProps, UserStub } from "../prismaContext"

const {debug} = useDebug('prisma/api/userApi', 'DEBUG')

const UserApi = () => {

  const followUser = async (props: UserFollowProps):Promise<boolean>  => {
    const like = await (await sendApi("user/follow", props)).data
    if (like.result) {
      return true
    } else {
      debug("Did not get right result?", like.result)
      return false
    }
  }

  const mentions = async (search:string|undefined):Promise<UserStub[]> => {
    debug('mentions', search)
    const list = await (await sendApi(`user/mentions`,{search,all:search===undefined})).data
    if (list) {
      return list as unknown as UserStub[]
    }
    return []
  }

  return {
    followUser,
    mentions
  }
}

export default UserApi