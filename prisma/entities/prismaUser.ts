import { NextApiRequest } from "next"
import { getSession, GetSessionParams } from "next-auth/react"
import useDebug from "hooks/useDebug"
import {
  GenericResponseError,
  ResponseError
} from "types/response"
import {
  AudienceLevels,
  audienceToLevel,
  BookStubInclude,
  CommentThreadStubInclude,
  CreatorStubInclude,
  CyfrUser,
  CyfrUserInclude,
  Follow,
  GalleryStub,
  GalleryStubInclude,
  Membership,
  MembershipType,
  prisma, User, UserDetail, UserDetailInclude, UserFeed,
  UserFollowProps,
  UserInfo,
  UserInfoInclude,
  UserStub
} from "prisma/prismaContext"
import dayjs from "dayjs"
import { cadenceInterval } from "prisma/hooks/useCyfrUserApi"
import { MembershipStub } from "prisma/types/membership.def"
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
    if (follow) {
      return follow
    }
    throw({code: fileMethod('follow'), message: 'Unable to follow user'})
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ error },
    })
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const userInfo = async (id:string): Promise<UserInfo> => {
  debug('userInfo', id)
  try {
    const result = await prisma.user.findUnique({
      where: { id },
      ...UserInfoInclude
    })

    if (result) return result as UserInfo
    
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
        },
        orderBy: {createdAt: 'desc'},
        take: 10
      },
      membership: {
        include: {
          type: true
        }
      },
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
    const expiresAt = new Date(dayjs().add(1, cadence).format('YYYY-MM-DD HH:mm:ss.sssZ'))

    let membership = user.membership ?? await prisma.membership.create({
      data: {
        visible: true,
        typeId,
        expiresAt
      },
      include: {
        type: true
      }
    })

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
        include: {
          type: true
        }
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
        membership: {
          include: {
            type: true
          }
        }
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
}: UserStub): Promise<User> => {
  try {
    debug('updatePreferences', {id, name, image})
    const user = await prisma.user.update({
      where: { id },
      data: { 
        name, 
        slug: name.replaceAll(/[\W_]+/g,"-").toLowerCase(),
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


