import { PrismaClient } from '@prisma/client'
import { __prod__ } from '../utils/constants';

declare global {
  var prisma: PrismaClient
}

var prisma:PrismaClient

if (__prod__) {
  prisma = new PrismaClient()
} else {
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