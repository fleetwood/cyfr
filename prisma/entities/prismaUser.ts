import { GetSessionParams, getSession } from "next-auth/react"
import { 
  Audience,
  CyfrUser, 
  CyfrUserInclude, 
  Fan, 
  FanProps, 
  Follow, 
  prisma, 
  UpdatePreferencesProps, 
  User, 
  UserDetail,
  UserDetailInclude,
  UserFeed,
  UserFeedInclude, 
} from "../prismaContext"
import {
  GenericResponseError,
  ResponseError,
  GetResponseError,
} from "../../types/response"
import { dedupe } from "../../utils/helpers"
import useDebug from "../../hooks/useDebug"
import { NextApiRequest } from "next"
import { Session } from "next-auth"
const {fileMethod, debug, info} = useDebug({fileName: 'entities/prismaUser'})

const follow = async (follows: string, follower: string): Promise<Follow> => {
  const data = {
    followerId: follower,
    followingId: follows,
  }
  try {
    if (follows === follower) {
      throw {
        code: "user/error",
        message: `Sorry you can't follow yourself. That would be weird, and probably break physics.`,
      }
    }
    const exists = await prisma.follow.findFirst({ where: data })
    if (exists) return exists
    const follow = await prisma.follow.create({ data })
    if (!follow) {
      throw {
        code: "users/follow",
        message: `Unable to follow (follows:${follows}, follower: ${follower})`,
      }
    }
    return follow
  } catch (error) {
    debug(`follow ERROR`, {
      ...{follows, follower},
      ...{data},
      ...{error}
    })
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const stan = async (props: FanProps): Promise<Fan> => {
  if (props.fanOfId === props.fanId) {
    throw {
      code: fileMethod("stan"),
      message: `We are fans of loving yourself, but cmon now...`,
    }
  }
  try {
    const exists = await prisma.fan.findFirst({
      where: props,
    })
    if (exists) {
      return exists
    }

    const follow = await prisma.fan.create({
      data: props,
    })
    if (!follow) {
      throw {
        code: fileMethod("stab"),
        message: `Unable to stan (stan:${props.fanOfId}, fan: ${props.fanId})`,
      }
    }
    return follow
  } catch (error) {
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const byId = async (id: string): Promise<UserDetail|undefined> => {
  try {
    debug('byId', {id})
    const user = await prisma.user.findUnique({
      where: {
        id: id?.toString(),
      },
      include: UserDetailInclude,
    })
    return user
      ? user as unknown as UserDetail
      : undefined

  } catch (error) {
    throw GetResponseError(error)
  }
}

const byName = async (name: string): Promise<UserDetail|undefined> => {
  try {
    debug('byName', {name})
    const user = await prisma.user.findMany({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
      include: UserDetailInclude,
    })
    
    return user[0]
      ? user[0] as unknown as UserDetail
      : undefined

  } catch (error) {
    throw GetResponseError(error)
  }
}

const byEmail = async (email: string): Promise<CyfrUser|null> => {
  try {
    if (!email) {
      return null
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: CyfrUserInclude
    })
    if (!user) {
      throw {
        code: fileMethod("byEmail"),
        message: `Did not find user for ${email}`,
      }
    }
    // log(`user.entity.byEmail found ${user.name}`)
    return user as CyfrUser
  } catch (error) {
    info(`byEmail FAIL`,error)
    throw error
  }
}

const byNameOrId = async (idOrName:string):Promise<UserDetail|undefined> => {
try {
  debug("byNameOrId", {idOrName})
  const userById = await byId(idOrName)
  if (userById) {
    return userById
  }
  const userByName = await byName(idOrName)
  if (userByName) {
    return userByName
  }
  throw {code: fileMethod('byNameOrId'), message: 'Unable to obtain a user by name or id'}
} catch (error) {
  debug('userById', {error})
  return undefined
}
}

const canMention = async (id: string, search?:string) => {
  try {
    // log(`prismaUser.canMention`, {id, search})
    const followers = await prisma.follow.findMany({
      where: {
        followingId: id,
        follower: {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        }
      },
      select: {
        follower: {
          include: {
            _count: {
              select: {
                sessions: true
              }
            }}
        },
      },
      take: 10
    })
    const fans = await prisma.fan.findMany({
      where: {
        fanOfId: id,
        fan: {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        }
      },
      select: {
        fan: {
          include: {
            _count: {
              select: {
                sessions: true
              }
            }}
        },
      },
      take: 10
    })
    return dedupe([
        ...followers.map(f => f.follower), 
        ...fans.map(f => f.fan)
      ], 'id')
      .slice(0,10) as unknown as User[]
  } catch (error) {
    info(`canMention broke`, error)
    throw error
  }
}

const userBySessionEmail = async (session:Session|null|undefined):Promise<UserDetail|null> => {
  if (session === undefined || session === null || session?.user === null || session?.user?.email === null) {
    return null
  } else {
    const email = session?.user?.email
    const currentUser = await PrismaUser.byEmail(email!)
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser?.id?.toString(),
      },
      include: UserDetailInclude
    })
    if (!user) {
      throw {
        code: fileMethod('userBySessionEmail'),
        message: currentUser
          ? `Did not find user for ${currentUser?.id}`
          : "No user in session",
      }
    }
    return user as unknown as UserDetail || null
  }
}

const userInSessionReq = async (req:NextApiRequest):Promise<UserDetail|null> => {
  try {
    const session = await getSession({req})
    return userBySessionEmail(session)
  } catch (e) {
    return null
  }
}

const userInSessionContext = async (context: GetSessionParams | undefined):Promise<UserDetail|null> => {
  try {
    const session = await getSession(context)
    return userBySessionEmail(session)
  } catch (error) {
    info(fileMethod('userInSessionContext'), {error})
    return null
  }
}

const setMembership = async (userId: string, audience:Audience, cadence:string):Promise<UserFeed|null> => {
  try {
    debug('setMembership', {userId, audience: audience, cadence})
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        membership: {
          upsert: {
            create: {
              level: audience
            },
            update: {
              level: audience
            }
          }
        }
      },
      include: UserFeedInclude
    })
    if (user) {
      return user as unknown as UserFeed || null
    }
    debug('setMembership', 'Null response when updating')
    return null
  } catch (e) {
    throw(e)
  }
}

const userCurrentlyOnline = async (id:string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            sessions: true
          }
        }
      }
    })
    if (!user) {
      throw {
        code: fileMethod('userCurrentlyOnline'),
        message: `Did not find user for ${id}`
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
}: UpdatePreferencesProps): Promise<User> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, image },
    })
    if (user) {
      return user
    }
    throw { code: "Users.updatePreferences", message: "Error updating record" }
  } catch (error) {
    throw error
  }
}

export const PrismaUser = {
  userInSessionContext,
  userInSessionReq,
  userCurrentlyOnline,
  byEmail,
  byName,
  byId,
  byNameOrId,
  follow,
  stan,
  setMembership,
  updatePreferences,
  canMention
}
