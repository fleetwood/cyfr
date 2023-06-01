import { NextApiRequest } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import useDebug from "../../hooks/useDebug";
import {
  GenericResponseError,
  ResponseError
} from "../../types/response";
import {
  Audience,
  CyfrUser, Follow,
  UserFollowProps,
  prisma, User, UserFeed,
  UserFeedInclude, UserStub, UserDetail
} from "../prismaContext";
const { fileMethod, debug, todo, info, err } = useDebug("entities/prismaUser", 'DEBUG');

type AllPostQueryParams = {
  limit?: Number;
  offset?: Number;
};

const allUsersQuery = async ({
  limit = 100,
  offset = 0,
}: AllPostQueryParams): Promise<any[] | []> => {
  debug("allUsersQuery");

  try {
    return await prisma.$queryRaw`
    select * from userInfoAll() as "user"
    `;
  } catch (error) {
    err("allUsersQuery", { error, limit, offset });
    throw { code: fileMethod("allUsersQuery"), message: "No posts were returned!" };
  }
};

const follow = async (props:UserFollowProps): Promise<Follow> => {
  const {followerId, followingId, isFan} = props;
  try {
    if (followerId === followingId) {
      throw {
        code: "user/error",
        message: `Sorry you can't follow yourself. That would be weird, and probably break physics.`,
      };
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
    if (!follow) {
      throw({code: fileMethod('follow'), message: 'Unable to follow user'})
    }
    return follow;
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
};

const userInfo = async (id:string): Promise<any> => {
  debug('userInfo', {id})
  try {
    const result:any[] = await prisma.$queryRaw<any[]>`select * from "v_user_info" where name = ${'Fleetwood'}`
    if (result[0]) {
      return result[0]
    }
    throw {code: fileMethod, message: 'Could not find info for that user id'}
  } catch (error) {
    throw error
  }
}

const detail = async (idOrNameOrEmail:string): Promise<any> => {
  try {
    if (!idOrNameOrEmail) {
      return null;
    }
    debug('detail', {idOrNameOrEmail})
    const user:UserDetail[] = await prisma.$queryRaw`
    SELECT * 
    FROM v_cyfruser
    WHERE id = ${idOrNameOrEmail}
      OR LOWER(name) = LOWER(${idOrNameOrEmail})
      OR LOWER(email) = LOWER(${idOrNameOrEmail})`
  
    if (user[0]) {
      debug('found user')
      return user[0];
    }
    debug('detail: Did not find a user', idOrNameOrEmail)
    return null

  } catch (error) {
    info(`detail FAIL`, error);
    throw error;
  }
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
    info(`canMention broke`, error);
    throw error;
  }
};

const userInSessionReq = async (
  req: NextApiRequest
): Promise<any | null> => {
  try {
    const session = await getSession({ req });
    debug('userInSessionReq', session)
    return detail(session?.user?.email||'')
  } catch (e) {
    debug('userInSessionReq FAIL', e)
    return null;
  }
};

const userInSessionContext = async (context: GetSessionParams | undefined): Promise<CyfrUser | null> => {
  try {
    const session = await getSession(context);
    return detail(session?.user?.email||'')
  } catch (error) {
    info(fileMethod("userInSessionContext"), { error });
    return null;
  }
};

const setMembership = async (
  userId: string,
  audience: Audience,
  cadence: string
): Promise<UserFeed | null> => {
  try {
    debug("setMembership", { userId, audience: audience, cadence });
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        membership: {
          upsert: {
            create: {
              level: audience,
            },
            update: {
              level: audience,
            },
          },
        },
      },
      include: UserFeedInclude,
    });
    if (user) {
      return (user as unknown as UserFeed) || null;
    }
    debug("setMembership", "Null response when updating");
    return null;
  } catch (e) {
    throw e;
  }
};

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
    });
    if (!user) {
      throw {
        code: fileMethod("userCurrentlyOnline"),
        message: `Did not find user for ${id}`,
      };
    }
    return user._count.sessions > 0;
  } catch (error) {
    info(`userCurrentlyOnline error`);
    return null;
  }
};

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
        slug: name.replaceAll(/[\W_]+/g,"-"),
        image },
    });
    if (user) {
      return user;
    }
    debug('updatePreferences', 'no user')
    throw { code: "Users.updatePreferences", message: "Error updating record" };
  } catch (error) {
    err('updatePreferences', {error})
    throw error;
  }
};

export const PrismaUser = {
  allUsersQuery,
  detail,
  userInfo,
  userInSessionContext,
  userInSessionReq,
  userCurrentlyOnline,
  follow,
  setMembership,
  updatePreferences,
  canMention,
};


