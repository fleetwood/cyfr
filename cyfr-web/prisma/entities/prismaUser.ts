import { GetSessionParams, getSession } from "next-auth/react"
import { stringify } from "superjson"
import { includes, CyfrUser, Fan, FanProps, Follow, prisma, UpdatePreferencesProps, User, UserDetail } from "../prismaContext"
import {
  GenericResponseError,
  ResponseError,
  GetResponseError,
} from "../../types/response"
import { log } from "../../utils/log"
import { dedupe } from "../../utils/helpers"

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
    log(`api/follow error...
      \n${stringify({ follows, follower })}
      \n${stringify(data)}
      \n${JSON.stringify(error, null, 2)}
    `)
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const stan = async (props: FanProps): Promise<Fan> => {
  if (props.fanOfId === props.fanId) {
    throw {
      code: "user/error",
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
        code: "users/stab",
        message: `Unable to stan (stan:${props.fanOfId}, fan: ${props.fanId})`,
      }
    }
    return follow
  } catch (error) {
    throw GenericResponseError(error as unknown as ResponseError)
  }
}

const byId = async (id: string): Promise<UserDetail> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id?.toString(),
      },
      include: includes.UserDetailInclude,
    })
    if (!user) {
      throw { code: "users/byId", message: `Did not find user for ${id}` }
    }
    return user
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
      include: {
        posts: true,
        likes: true,
        following: true,
        follower: true,
        fans: true,
        fanOf: true,
      },
    })
    if (!user) {
      throw {
        code: "user.entity.byEmail",
        message: `Did not find user for ${email}`,
      }
    }
    // log(`user.entity.byEmail found ${user.name}`)
    return user as CyfrUser
  } catch (error) {
    log(`user.entity.byEmail FAIL
      ${JSON.stringify(error, null, 2)}
    `)
    throw error
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
    log(`prismaUser.canMention broke ${JSON.stringify(error, null, 2)}`)
    throw error
  }
}

const userInSession = async (context: GetSessionParams | undefined) => {
  try {
    const session = await getSession(context)
    const currentUser = await byEmail(session?.user?.email!)
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser?.id?.toString(),
      },
      include: {
        posts: {
          include: {
            author: true,
            likes: true,
          },
        },
        likes: true,
        following: {
          include: {
            following: true,
            follower: true,
          },
        },
        follower: {
          include: {
            following: true,
            follower: true,
          },
        },
        fanOf: {
          include: {
            fanOf: true,
            fan: true,
          },
        },
        fans: {
          include: {
            fanOf: true,
            fan: true,
          },
        },
      },
    })
    if (!user) {
      throw {
        code: "Users.userInSession()",
        message: currentUser
          ? `Did not find user for ${currentUser?.id}`
          : "No user in session",
      }
    }
    return user
  } catch (error) {
    log(`Error getting userInSession`)
    return null
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
        code: "Users.userInSession()",
        message: `Did not find user for ${id}`
      }
    }
    return user._count.sessions > 0
  } catch (error) {
    log(`Error getting userInSession`)
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
  userInSession,
  userCurrentlyOnline,
  byEmail,
  byId,
  follow,
  stan,
  updatePreferences,
  canMention,
}
