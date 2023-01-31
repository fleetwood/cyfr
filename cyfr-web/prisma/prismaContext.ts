import { __prod__ } from '../utils/constants';
import { log } from '../utils/log';
import { PrismaClient, Post, User, Share, Like, Follow, Fan } from '@prisma/client/edge'
import { UserFeed, UserDetail, CyfrUser } from './types/user.def';
import { PostCreateProps, PostEngageProps, PostCommentProps, PostBase, PostFeed, PostDetail } from './types/post.def';
import {Posts} from './entities/post.entity'
import {Users} from './entities/user.entity'

declare global {
  var prisma: PrismaClient
}

var prisma:PrismaClient

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
/**
 * Prisma Client is a singleton in the global scope
 * @type {PrismaClient}
 */
export { prisma, Posts, Users };
export type { Post, User, Follow, Fan, Share, Like }
export type { UserFeed, UserDetail, CyfrUser }
export type { PostCreateProps, PostEngageProps, PostCommentProps, PostBase, PostFeed, PostDetail }
