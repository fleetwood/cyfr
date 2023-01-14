
import { Fan, Post, User, Follow } from ".prisma/client";
import { stringify } from "superjson";

import {
  ResponseResult,
  GetResponseError,
  GenericResponseError,
  ResponseError,
} from "../types/response";
import { log } from "../utils/log";
import { prisma } from "./prismaContext";

export type UsersResponse = ResponseResult<User[]>;
export type UserResponse = ResponseResult<User>;
export type UserWithPosts = User & {
  posts: Post[];
};

export type UserFollows = Follow & {
  following: User
  follower: User
};

export type UserFans = Fan & {
  fan: User
  fanOf: User
};

export type UserDetail = User & {
  posts: Post[];
  following: UserFollows[]
  follower: UserFollows[]
  fans: UserFans[]
  fanOf: UserFans[]
};

const follow = async (follows: string, follower: string): Promise<Follow> => {
  const data = {
    followerId: follower,
    followingId: follows,
  };
  try {
    log(`api/follow
      \n${stringify({ follows, follower })}
      \n${stringify(data)}
    `);
    if (follows === follower) {
      throw {
        code: "user/error",
        message: `Sorry you can't follow yourself. That would be weird, and probably break physics.`,
      };
    }
    const exists = await prisma.follow.findFirst({ where: data });
    if (exists) {
      log(`api/follow Follow already exists...
        \n${stringify({ follows, follower })}
        \n${stringify(data)}
      `);
      return exists;
    }
    const follow = await prisma.follow.create({ data });
    if (!follow) {
      log(`api/follow follow.create did not return data
        \n${stringify({ follows, follower })}
        \n${stringify(data)}
      `);
      throw {
        code: "users/follow",
        message: `Unable to follow (follows:${follows}, follower: ${follower})`,
      };
    }
    log(`api/follow Success...
      \n${stringify({ follows, follower })}
      \n${stringify(data)}
    `);
    return follow;
  } catch (error) {
    log(`api/follow some weird error...
      \n${stringify({ follows, follower })}
      \n${stringify(data)}
      \n${JSON.stringify(error, null, 2)}
    `);
    throw GenericResponseError(error as unknown as ResponseError);
  }
};

const stan = async (stan: string, fan: string): Promise<Fan> => {
  if (stan === fan) {
    throw {
      code: "user/error",
      message: `We are fans of loving yourself, but cmon now...`,
    };
  }
  try {
    const exists = await prisma.fan.findFirst({
      where: {
        starId: stan,
        fanId: fan,
      },
    });
    if (exists) {
      return exists;
    }

    const follow = await prisma.fan.create({
      data: {
        starId: stan,
        fanId: fan,
      },
    });
    if (!follow) {
      throw {
        code: "users/stab",
        message: `Unable to stan (stan:${stan}, fan: ${fan})`,
      };
    }
    return follow;
  } catch (error) {
    throw GenericResponseError(error as unknown as ResponseError);
  }
};

const byId = async (id: string): Promise<UserDetail> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id?.toString(),
      },
      include: {
        posts: true,
        following: {
            include: {
                following: true,
                follower: true
            }
        },
        follower: {
            include: {
                following: true,
                follower: true
            }
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
    });
    if (!user) {
      throw { code: "users/byId", message: `Did not find user for ${id}` };
    }
    return user;
  } catch (error) {
    throw GetResponseError(error);
  }
};

const byEmail = async (email: string): Promise<UserWithPosts | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email?.toString(),
      },
      include: {
        posts: true,
      },
    });
    if (!user) {
      throw {
        code: "users/byEmail",
        message: `Did not find user for ${email}`,
      };
    }
    return user;
  } catch (error) {
    throw GetResponseError(error);
  }
};

export const Users = { byEmail, byId, follow, stan };
