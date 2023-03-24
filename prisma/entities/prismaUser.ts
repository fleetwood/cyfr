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
  FollowProps,
  prisma, User, UserFeed,
  UserFeedInclude, UserProps
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

const follow = async (props:FollowProps): Promise<Follow> => {
  const data = {props};
  try {
    if (props.followerId === props.followingId) {
      throw {
        code: "user/error",
        message: `Sorry you can't follow yourself. That would be weird, and probably break physics.`,
      };
    }
    const exists = await prisma.follow.findFirst({ where:{...props} });
    if (exists) return exists;
    const follow = await prisma.follow.create({ data: props});
    if (!follow) {
      throw {
        code: "users/follow",
        message: `Unable to follow (${props}})`,
      };
    }
    return follow;
  } catch (error) {
    debug(`follow ERROR`, {
      ...{ props },
      ...{ data },
      ...{ error },
    });
    throw GenericResponseError(error as unknown as ResponseError);
  }
};

const getCyfrUser = async (idOrNameOrEmail:string): Promise<CyfrUser | null> => {
  debug('getCyfrUser', idOrNameOrEmail)
  try {
    if (!idOrNameOrEmail) {
      return null;
    }
    const user:any[] = await prisma.$queryRaw`SELECT f_cyfrUser(${idOrNameOrEmail}) as "cyfrUser"`;
    if (!user[0].cyfrUser) {
        throw {
          code: fileMethod("getCyfrUser"),
          message: `Did not find user for ${idOrNameOrEmail}`,
        }
    }
      try {
        debug('casting cyfrUser', {
          any: user[0].cyfrUser,
          cyfrUser: user[0].cyfrUser as CyfrUser
        })
      } catch (error) {
      
    }
    return user[0].cyfrUser as CyfrUser;
  } catch (error) {
    info(`getCyfrUser FAIL`, error);
    throw error;
  }
}

const byId = async (id: string) => getCyfrUser(id)

const byName = async (name: string) => getCyfrUser(name)

const byEmail = async (email: string) => getCyfrUser(email)

const byNameOrId = async (idOrName: string) => getCyfrUser(idOrName)

const canMention = async (id: string, search?: string):Promise<any> => {
  try {
    todo(
      "canMention",
      "Remove this in favor of a property in cyrUserContext...."
    );
    const mentions = await prisma.$queryRaw`SELECT * from f_can_Mention(${id})`
    debug('mentions', {mentions})
    return mentions || []
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
    return getCyfrUser(session?.user?.email||'')
  } catch (e) {
    debug('userInSessionReq FAIL', e)
    return null;
  }
};

const userInSessionContext = async (context: GetSessionParams | undefined): Promise<CyfrUser | null> => {
  try {
    const session = await getSession(context);
    return getCyfrUser(session?.user?.email||'')
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
}: UserProps): Promise<User> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, image },
    });
    if (user) {
      return user;
    }
    throw { code: "Users.updatePreferences", message: "Error updating record" };
  } catch (error) {
    throw error;
  }
};

export const PrismaUser = {
  allUsersQuery,
  userInSessionContext,
  userInSessionReq,
  userCurrentlyOnline,
  byEmail,
  byName,
  byId,
  byNameOrId,
  follow,
  setMembership,
  updatePreferences,
  canMention,
};
