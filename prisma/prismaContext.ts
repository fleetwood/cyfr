import { PrismaClient } from "@prisma/client"
import useDebug from "../hooks/useDebug"
import { __prod__ } from "../utils/constants"
const {info} = useDebug('prismaContext')
declare global {
  var prisma: PrismaClient
}

/**
 * Prisma Client is a singleton in the global scope
 * @type {PrismaClient}
 */
export var prisma: PrismaClient

if (__prod__) {
  info(`prisma is running on prod`)
  prisma = new PrismaClient()
} else {
  info(`prisma is running globally`)
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      // log: ['query']
    })
  }
  prisma = global.prisma
}

export * from "./types"
export * from './entities'