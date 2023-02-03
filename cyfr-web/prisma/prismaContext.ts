import { __prod__ } from "../utils/constants"
import { log } from "../utils/log"
import { PrismaSession } from "./entities/prismaSession"
import { PrismaShare } from "./entities/prismaShare"
import {
  PrismaClient,
  Post,
  User,
  Share,
  Like,
  Follow,
  Fan,
} from "@prisma/client/edge"
import { ShareDeleteProps, ShareFeed } from "./types/share.def"
import { UserFeed, UserDetail, CyfrUser } from "./types/user.def"
import {
  PostCreateProps,
  PostDeleteProps,
  PostEngageProps,
  PostCommentProps,
  PostBase,
  PostFeed,
  PostDetail,
} from "./types/post.def"
import { PrismaPost } from "./entities/prismaPost"
import { PrismaUser } from "./entities/prismaUser"

declare global {
  var prisma: PrismaClient
}

/**
 * Prisma Client is a singleton in the global scope
 * @type {PrismaClient}
 */
var prisma: PrismaClient

if (__prod__) {
  log(`prisma is running on prod`)
  prisma = new PrismaClient()
} else {
  log(`prisma is running globally`)
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

/*******************************/
/*******************************/
/*******************************/

export { prisma, PrismaPost, PrismaUser, PrismaSession, PrismaShare }
export type { Post, User, Follow, Fan, Share, Like }
export type { ShareFeed, UserFeed, UserDetail, CyfrUser }
export type {
  PostCreateProps,
  PostDeleteProps,
  PostEngageProps,
  PostCommentProps,
  PostBase,
  PostFeed,
  PostDetail,
  ShareDeleteProps
}
