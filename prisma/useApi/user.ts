import useRocketQuery from "hooks/useRocketQuery"
import useDebug from "hooks/useDebug"
import { getApi, sendApi } from "utils/api"
import { AudienceLevels, Book, PrismaUser, UserDetail, UserDetailProps, UserFollowProps, UserInfo, UserSearchProps, UserSearchStub, UserStub, UserTypes } from "prisma/prismaContext"

const {debug} = useDebug('prisma/api/userApi', )

  const query = (props:UserDetailProps) => {
    debug('query', props)
    const {slug} = props
    return useRocketQuery<UserDetail>({
      name: [`userDetail-${slug}`, { type: 'user'}],
      url: `user/${slug}`,
    })
  }

  const canAccess = async (level:AudienceLevels) => await (await sendApi("user/access", {level})).data === true

  const followUser = async (props: UserFollowProps):Promise<boolean>  => await (await sendApi("user/follow", props)).data

  const friends = async (id:string, search?:string):Promise<UserStub[]> => await getApi(`user/${id}/friends${search?`?s=${search}`:''}`)

  const search = async (props: UserSearchProps): Promise<UserSearchStub[]> => await (await sendApi(`user/search`, props)).data as UserSearchStub[]

  const detail = async (props: UserDetailProps):Promise<UserDetail> => await (await sendApi('user/detail', props)).data as UserDetail

  const mentions = async (search:string|undefined):Promise<UserStub[]> => {
    debug('mentions (Not Implemented)', search)
    return []
    const list = await (await sendApi(`user/mentions`,{search,all:search===undefined})).data
    if (list) {
      return list as unknown as UserStub[]
    }
    return []
  }

  /**
   * @see {@link PrismaUser.userInfo} info
   * @param id 
   * @returns Promise:{@link UserInfo} 
   */
  const info = async (id: string, userType?: UserTypes):Promise<UserInfo> => await getApi(`user/${id}/info${userType ? `?t=${userType}`:``}`)

  const books = async (id:String):Promise<Book[]> => await (await getApi(`user/books/${id}`)).data

const UserApi = () => {
  return {
    query,
    canAccess,
    followUser,
    mentions,
    books,
    friends,
    info,
    detail,
    search
  }
}

export default UserApi