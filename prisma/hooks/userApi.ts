import useRocketQuery from "hooks/useRocketQuery"
import useDebug from "hooks/useDebug"
import { getApi, sendApi } from "utils/api"
import { AudienceLevels, Book, UserDetail, UserDetailProps, UserFollowProps, UserInfo, UserStub } from "prisma/prismaContext"

const {debug} = useDebug('prisma/api/userApi', 'DEBUG')

  const query = (props:UserDetailProps) => {
    debug('query', props)
    const {slug} = props
    return useRocketQuery<UserDetail>({
      name: [`userDetail-${slug}`, { type: 'user'}],
      url: `user/${slug}`,
    })
  }

  const canAccess = async (level:AudienceLevels) => await (await sendApi("user/access", {level})).data === true

  const followUser = async (props: UserFollowProps):Promise<boolean>  => {
    const like = await (await sendApi("user/follow", props)).data
    if (like.result) {
      return true
    } else {
      debug("Did not get right result?", like.result)
      return false
    }
  }

  const detail = async (props: UserDetailProps):Promise<UserDetail> => await (await sendApi('user/detail', props)).data as UserDetail

  const mentions = async (search:string|undefined):Promise<UserStub[]> => {
    debug('mentions', search)
    const list = await (await sendApi(`user/mentions`,{search,all:search===undefined})).data
    if (list) {
      return list as unknown as UserStub[]
    }
    return []
  }

  const info = async (id: string):Promise<UserInfo> => await getApi(`user/${id}/info`) as UserInfo

  const books = async (id:String):Promise<Book[]> => await (await getApi(`user/books/${id}`)).data

const UserApi = () => {
  return {
    query,
    canAccess,
    followUser,
    mentions,
    books,
    info,
    detail
  }
}

export default UserApi