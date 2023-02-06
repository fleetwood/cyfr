import { __prod__ } from "../utils/constants"
import { log } from "../utils/log"
import { PrismaSession } from "./entities/prismaSession"
import { PrismaShare } from "./entities/prismaShare"

import { PrismaClient } from "@prisma/client"
import { PrismaPost } from "./entities/prismaPost"
import { PrismaUser } from "./entities/prismaUser"
import {
  CyfrUser,
  Fan,
  Follow,
  Gallery, GalleryItem, GalleryDetail,
  Image,
  Like,
  MainFeed,
  Post,
  PostBase,
  PostCommentProps,
  PostCreateProps, PostDeleteProps,
  PostDetail,
  PostEngageProps,
  PostFeed,
  Share,
  ShareDeleteProps,
  ShareFeed,
  User,
  UserDetail,
  UserFeed
} from "./types"

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
export type {
  Post, User, Follow, Fan, Share, Like, Image, Gallery,
  ShareDeleteProps, ShareFeed,
  GalleryItem, GalleryDetail,
  UserFeed, UserDetail, CyfrUser,
  MainFeed,
  PostCreateProps, PostDeleteProps, PostEngageProps, PostCommentProps, PostBase, PostFeed, PostDetail,
}

