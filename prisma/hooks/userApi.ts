import useDebug from "../../hooks/useDebug"
import { getApi, sendApi } from "../../utils/api"
import { AudienceLevels, Book, CyfrUser, UserDetailProps, UserEngageProps, UserFollowProps, UserStub } from "../prismaContext"

const {debug} = useDebug('prisma/api/userApi')

const UserApi = () => {

  const canAccess = async (level:AudienceLevels) => await (await sendApi("user/access", {level})).data.result === true

  const followUser = async (props: UserFollowProps):Promise<boolean>  => {
    const like = await (await sendApi("user/follow", props)).data
    if (like.result) {
      return true
    } else {
      debug("Did not get right result?", like.result)
      return false
    }
  }

  const detail = async (props: UserDetailProps) => await (await sendApi('user/detail', props))

  const mentions = async (search:string|undefined):Promise<UserStub[]> => {
    debug('mentions', search)
    const list = await (await sendApi(`user/mentions`,{search,all:search===undefined})).data
    if (list) {
      return list as unknown as UserStub[]
    }
    return []
  }

  const info = async (id: string) => await (await getApi(`user/${id}/info`)).data

  const books = async (id:String):Promise<Book[]> => await (await getApi(`user/books/${id}`)).data

  return {
    canAccess,
    followUser,
    mentions,
    books,
    info,
    detail
  }
}

export default UserApi