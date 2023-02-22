import useDebug from "../../hooks/useDebug"
import { CommentThreadDetailsInclude, InboxProps } from "../prismaContext"
const [debug, fileMethod] = useDebug('entities/prismaComment', 'DEBUG')

const userInbox = async (userId: string): Promise<any[]> => {
  try {
    debug(`userInbox`, userId)
    const inbox = await prisma.commentThread.findMany({
      where: {
        entity: 'INBOX',
        commune: {
          users: {
            some: {
              userId
            },
            none: {
              role: 'BLOCKED'
            }
          }
        }
      },
      include: {
        commune: {
          include: {
            users: true
          }
        },
        comments: {
          include: {
            author: true,
            _count: {
              select: {
                likes: true
              }
            }
          }
        }
      }
    })
    debug(`userInbox result`, inbox)
    if (inbox) {
      return inbox
    }
    throw {
      code: fileMethod(`userInbox`),
      message: "Unable to obtain inbox for user",
    }
  } catch (error) {
    throw error
  }
}

const inbox = async ({
  threadId,
  userId,
  partyId,
}: InboxProps): Promise<any> => {
  try {
    const create = {
      entity: "INBOX",
      requiredRole: "PRIVATE",
      commune: {
        create: {
          entity: "INBOX",
          ownerId: userId,
          users: {
            createMany: {
              data: [
                { userId: userId, role: "OWNER" },
                { userId: partyId, role: "OWNER" },
              ],
            },
          },
        },
      },
    }

    const thread = await prisma.commentThread.upsert({
      where: {
        id: threadId,
      },
      update: {},
      create: {
        entity: "INBOX",
        requiredRole: "PRIVATE",
        commune: {
          create: {
            entity: "INBOX",
            ownerId: userId,
            users: {
              createMany: {
                data: [
                  { userId: userId, role: "OWNER" },
                  { userId: partyId, role: "OWNER" },
                ],
              },
            },
          },
        },
      },
      include: CommentThreadDetailsInclude,
    })
    debug("inbox result", { create, thread })
    if (thread) {
      return thread
    }
    throw {
      code: fileMethod("inbox"),
      message: "Unable to find or create inbox",
    }
  } catch (error) {
    throw error
  }
}

export const PrismaComment = { userInbox, inbox }
