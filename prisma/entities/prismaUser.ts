import dayjs from "dayjs"
import useDebug from "hooks/useDebug"
import {NextApiRequest} from "next"
import {getSession, GetSessionParams} from "next-auth/react"
import {
  AgentInfoSelect,
  ArtistInfoSelect,
  AudienceLevels,
  audienceToLevel,
  AuthorInfoSelect,
  BookStubInclude,
  CyfrUser,
  CyfrUserInclude,
  EditorInfoSelect,
  Follow,
  GalleryStub,
  GetInfoSelector,
  MapInfo,
  Membership,
  MembershipStub,
  MembershipStubSelect,
  prisma, ReaderInfoSelect, User, UserDetail,
  UserFollowProps,
  UserInfo,
  UserInfoSelect,
  UserInfoType,
  UserSearchProps,
  UserSearchStub,
  UserSearchStubSelect,
  UserStub,
  UserTypes
} from "prisma/prismaContext"
import {cadenceInterval} from "prisma/useApi/cyfrUser"
import {
  GenericResponseError,
  ResponseError
} from "types/response"
import {dbDateFormat, dedupe, toSlug} from "utils/helpers"
const { fileMethod, debug, info, err } = useDebug("entities/prismaUser", 'DEBUG')

type AllPostQueryParams = {
  limit?: Number
  offset?: Number
}

const allUsersQuery = async ({
  limit = 100,
  offset = 0,
}: AllPostQueryParams): Promise<any[] | []> => {
  debug("allUsersQuery")

  try {
    return await prisma.$queryRaw`
    select * from userInfoAll() as "user"
    `
  } catch (error) {
    err("allUsersQuery", { error, limit, offset })
    throw { code: fileMethod("allUsersQuery"), message: "No posts were returned!" }
  }
}

const follow = async (props:UserFollowProps): Promise<Follow> => {
  const {followerId, followingId, isFan} = props
  try {
    if (followerId === followingId) {
      throw {
        code: "user/error",
        message: `Sorry you can't follow yourself. That would be weird, and probably break physics.`,
      }
    }
    // we have to do this crazy little dance because composites in Follow model
    const exists = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId
      }
    })
    const data = {followerId,followingId,isFan}
    const include = {follower: true,following: true}
    debug('follow', {followerId, followingId, data})

    const follow = exists 
      ? await prisma.follow.update({
        where: {id: exists.id},
        data,
        include
      })
      : await prisma.follow.create({
        data,
        include
      })
    return follow
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ error },
    }, true)
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const userInfo = async <T = UserInfoType>(id:string, userType?:UserTypes): Promise<T> => {
  debug('userInfo', {id, userType})
  try {
    let select = GetInfoSelector(userType)
    debug('select', select)
    const result = await prisma.user.findUnique({
      where: { id },
      ...select
    })

    if (result) {
      debug('result', result)
      return MapInfo<T>(result, userType)
    }
    
    throw {code: fileMethod, message: 'Could not find info for that user id'}
  } catch (error) {
    err('userInfo', error)
    throw error
  }
}

export type UserDetailProps = {
  id?:    string
  name?:  string
  email?: string
  slug?:  string
}

const detail = async (props:UserDetailProps): Promise<UserDetail> => {
  const {id, name, email, slug} = props
  const where = name ? { name: name}
    : email ? { email: email}
    : slug ? { slug : slug.toLowerCase() }
    : { id : id}
  debug('detail', {where})
  return await prisma.user.findUnique({
    where: where,
    include: {
      galleries: {
        where: {
          visible: true
        },
        include: {
          creator: true,
          images: {
            include: {
            _count: {
              select: {
                likes: true,
                shares: true
              }
            }}
          },
          _count: {
            select: {
              likes: true,
              shares: true
            }
          }
        }
      },
      books: {
        where: {
          visible: true
        },
        include: {
          cover: true,
          authors: true,
          _count: {
            select: {
              chapters: true,
              characters: true,
              likes: true,
              shares: true
            }
          }
        }
      },
      follower: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
            }
          },
        },
        orderBy: {createdAt: 'desc'},
        take: 10
      },
      following: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
            }
          },
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              slug: true,
            }
          },
        },
        orderBy: {createdAt: 'desc'},
        take: 10
      },
      membership: MembershipStubSelect,
      _count: {
        select: {
          likes: true,
          posts: true,
          follower: true,
          following: true,
          books: true,
          galleries: true,
          submissions: true
        }
      }
    }
  }) as unknown as UserDetail
}

const books = async (props:UserDetailProps): Promise<any> => {
  const {id, name, email, slug} = props
  const user = 
      name ? { name: name}
      : email ? { email: email}
      : slug ? { slug : slug.toLowerCase() }
      : { id : id}
  debug('books', {props, user})
  const books = await prisma.book.findMany({
    where: { 
      authors: {
        some: {
          user,
          visible: true
        }
      }
    },
    ...BookStubInclude
  })
  debug('result', books)
  return books
}

const galleries = async (props:UserDetailProps): Promise<GalleryStub[]> => {
  const {id, name, email, slug} = props
  const user = 
      name ? { name: name}
      : email ? { email: email}
      : slug ? { slug : slug.toLowerCase() }
      : { id : id}
  debug('galleries', {props, user})
  const result = await prisma.gallery.findMany({
    where: { 
      creator: {
        ...user
      }
    },
    include: {
      creator: {
        select: {
            id: true,
            name: true,
            image: true,
            slug: true
        }
      },
      images: {
        include: {
        _count: {
          select: {
            likes: true
          }
        }}
      },
      permission: true,
      _count: {
        select: {
          likes: true,
          shares: true
        }
      }
    }
  }) as GalleryStub[]
  return result
}

const cyfrUser = async (email:string): Promise<CyfrUser> => await prisma.user.findUnique({where: { email },include: CyfrUserInclude}) as unknown as CyfrUser

type FriendStub = {
  follower: {
    id: string,
    name: string,
    email: string,
    image?: string,
    slug: string,
    membership: Membership
  }
  following: {
    id: string,
    name: string,
    email: string,
    image?: string,
    slug: string,
    membership: Membership
  }
}
const friends = async(id:string, search?: string): Promise<UserStub[]> => {
  const f = await prisma.follow.findMany({
    where: {
      OR:[ 
        {followerId: id},
        {followingId: id}
      ],
      AND: {
        OR: [
          {follower: {name: {contains: search, mode: 'insensitive'}, id: { not: id}}},
          {following: {name: {contains: search, mode: 'insensitive'}, id: { not: id}}}
        ]
      }
    },
    select: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          slug: true,
          membership: true
        }
      },
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          slug: true,
          membership: true
        }
      }
    }
  }) as FriendStub[]

  const users = f.filter((u:FriendStub) => 
      f.find((x:FriendStub) => x.following.id === u.follower.id && x.follower.id === u.following.id)
    ).map((fr:FriendStub) => {
      return fr.follower.id !== id ? {...fr.follower} : {...fr.following}
    })

  return dedupe(users, 'id') as UserStub[]
}

const search = async ({id, search, followerTypes, userTypes, agg}:UserSearchProps): Promise<UserSearchStub[]> => {
  // if followerTypes: FIND ONLY USERS WHO MATCH FOLLOWER TYPE
  // if userTypes: FIND ONLY USERS WHO MATCH USER TYPE
  // if both:  FIND ONLY USERS WITH BOTH
  debug('search', {id, search, followerTypes, userTypes, agg})

  const filter = (followerTypes && followerTypes.length>= 1) || (userTypes && userTypes.length>=1)

  // @ts-ignore
  let queryResults: UserSearchStub[] = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: search ?? '', mode: 'insensitive' } },
        { id: search },
      ],
    },
    select: UserSearchStubSelect(id)
  })

  // don't include the user
  queryResults = queryResults.filter(u => u.id !== id)
  if (!filter) return queryResults
  
  let filterResults:UserSearchStub[] = agg ? [] : [...queryResults]
  const filterUsers = (filteredSet:UserSearchStub[]) => {
    // if agg, append the filteredSet to filterResults, otherwise replace filterResults with the filteredSet
    filterResults = agg ? [...filterResults,...filteredSet] : [...filteredSet]
  }

  // if agg, using the filter clone methodology to either filter against the entire queryResults, or the diminishing filterResults
  if (followerTypes?.includes('Followers')) filterUsers((agg ? queryResults : filterResults).filter((u: UserSearchStub) => u.follower.length > 0))
  if (followerTypes?.includes('Fans')) filterUsers((agg ? queryResults : filterResults).filter((u: UserSearchStub) => u.follower.some(f => f.isFan)))
  if (followerTypes?.includes('Following')) filterUsers((agg ? queryResults : filterResults).filter((u: UserSearchStub) => u.following.length>0))
  if (followerTypes?.includes('Stans')) filterUsers((agg ? queryResults : filterResults).filter((u: UserSearchStub) => u.following.some(f => f.isFan)))
  if (userTypes?.includes('Agent')) filterUsers((agg ? queryResults : filterResults).filter((u:UserSearchStub)=> u.agent))
  if (userTypes?.includes('Author')) filterUsers((agg ? queryResults : filterResults).filter((u:UserSearchStub)=> u.author))
  if (userTypes?.includes('Artist')) filterUsers((agg ? queryResults : filterResults).filter((u:UserSearchStub)=> u.artist))
  if (userTypes?.includes('Editor')) filterUsers((agg ? queryResults : filterResults).filter((u:UserSearchStub)=> u.editor))
  if (userTypes?.includes('Reader')) filterUsers((agg ? queryResults : filterResults).filter((u:UserSearchStub)=> u.reader))

  return dedupe(filterResults, 'id')
}

type MentionSearchProps = {
  search?:  string
  all?:     boolean
}
const canMention = async ({search, all = false}:MentionSearchProps):Promise<any> => {
  try {
    if (search) {
      debug('canMention', {search, all})
      return await prisma.$queryRaw`
        SELECT v.* 
        from v_user_info v 
        WHERE LOWER(v.name) LIKE LOWER(${`%${search}%`})
        order by v.name
        limit 50
      `
    }
    debug('no search term')
    return await prisma.$queryRaw`
      SELECT v.* 
      from v_user_info v 
      order by v.name
      limit 50
    `
  } catch (error) {
    info(`canMention broke`, error)
    throw error
  }
}

const userInSessionReq = async (req: NextApiRequest): Promise<CyfrUser> => cyfrUser((await getSession({ req }))?.user?.email||'')

const userInSessionContext = async (context: GetSessionParams | undefined): Promise<CyfrUser> => cyfrUser((await getSession(context))?.user?.email||'')

const setMembership = async (
  user:     CyfrUser,
  typeId:   string,
  cadence:  cadenceInterval,
): Promise<MembershipStub> => {
  try {
    debug("setMembership", { user, typeId, cadence })
    const expiresAt = new Date(dayjs().add(1, cadence).format(dbDateFormat))

    let membership:MembershipStub =
      user.membership ??
      (await prisma.membership.create({
        data: {
          visible: true,
          typeId,
          expiresAt,
        },
        ...MembershipStubSelect
      }))

    if (membership.type?.id !== typeId || !(dayjs(membership.expiresAt).isSame(expiresAt))) {
      debug('updating that membership tho...')
      membership = await prisma.membership.update({
        where: {
          id: membership.id
        },
        data: {
          typeId,
          expiresAt
        },
        ...MembershipStubSelect
      })
    }

    const result = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        membershipId: membership.id
      },
      include: {
        membership: MembershipStubSelect
      }
    })
    debug('Updated the user then', result)

    if (result) {
      return result.membership as MembershipStub
    }

    throw({code: 'prismaUser.setMembership', message: 'Failed setting membership'})
  } catch (e) {
    throw e
  }
}

const userCurrentlyOnline = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    })
    if (!user) {
      throw {
        code: fileMethod("userCurrentlyOnline"),
        message: `Did not find user for ${id}`,
      }
    }
    return user._count.sessions > 0
  } catch (error) {
    info(`userCurrentlyOnline error`)
    return null
  }
}

const updatePreferences = async ({
  id,
  name,
  image,
}: {id: string, name: string, image: string}): Promise<User> => {
  try {
    debug('updatePreferences', {id, name, image})
    const user = await prisma.user.update({
      where: { id },
      data: { 
        name, 
        slug: toSlug(name),
        image },
    })
    if (user) {
      return user
    }
    debug('updatePreferences', 'no user')
    throw { code: "Users.updatePreferences", message: "Error updating record" }
  } catch (error) {
    err('updatePreferences', {error})
    throw error
  }
}

const canAccess = async (audience:AudienceLevels, cyfrUser?:CyfrUser):Promise<boolean> => audienceToLevel((cyfrUser?.membership?.type.level??'PUBLIC').toString()) >= audienceToLevel(audience)

export const PrismaUser = {
  allUsersQuery,
  canAccess,
  cyfrUser,
  detail,
  friends,
  search,
  galleries,
  userInfo,
  userInSessionContext,
  userInSessionReq,
  userCurrentlyOnline,
  follow,
  setMembership,
  updatePreferences,
  canMention,
  books
}


