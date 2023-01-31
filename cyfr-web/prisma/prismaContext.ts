import { PrismaClient } from '@prisma/client'
import { __prod__ } from '../utils/constants';
import { log } from '../utils/log';

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
export { prisma };