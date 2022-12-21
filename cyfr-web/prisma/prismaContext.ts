import { PrismaClient } from "@prisma/client";
import { __prod__ } from "../utils/constants";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (!__prod__) global.prisma = prisma;