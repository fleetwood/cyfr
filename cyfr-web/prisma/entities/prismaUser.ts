import { GetSessionParams, getSession } from "next-auth/react"
import { stringify } from "superjson"
import { Follow, Fan, User, Post, Like } from ".prisma/client"
import {prisma} from '../prismaContext'
import { GenericResponseError, ResponseError, GetResponseError } from "../../types/response"
import { log } from "../../utils/log"
import { FanProps } from "../types/follow.def"
import { CyfrUser, UserDetail, UserDetailInclude } from "../types/user.def"

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

const stan = async (props:FanProps): Promise<Fan> => {
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
      include: UserDetailInclude
    })
    if (!user) {
      throw { code: "users/byId", message: `Did not find user for ${id}` }
    }
    return user
  } catch (error) {
    throw GetResponseError(error)
  }
}

const byEmail = async (email: string):Promise<CyfrUser> => {
  try {
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
        fanOf:true
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
      ${JSON.stringify(error,null,2)}
    `)
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
              likes: true
            }
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
        throw { code: "Users.userInSession()", message: currentUser ? `Did not find user for ${currentUser?.id}` : 'No user in session' }
      }
      return user
    } catch (error) {
      log(`Error getting userInSession`)
      return null
    }
}

type updatePreferencesProps = {
  id:string
  name:string
  image:string
}
const updatePreferences = async ({id, name, image}:updatePreferencesProps):Promise<User> => {
  try {
    const user = await prisma.user.update({ 
      where:{id},
      data: { name, image }
    })
    if (user) {
      return user
    }
    throw({code: 'Users.updatePreferences', message: 'Error updating record'})
  } catch (error) {
    throw error
  }
}

export const PrismaUser = { userInSession, byEmail, byId, follow, stan, updatePreferences }
