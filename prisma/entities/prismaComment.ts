import useDebug from "../../hooks/useDebug"
import { CommentThreadDetails, CommentThreadDetailsInclude, UpsertInboxProps } from "../prismaContext"
const {debug, fileMethod} = useDebug({fileName: 'entities/prismaComment'})

const threadById = async (threadId: string, userId: string): Promise<CommentThreadDetails> => {
  try {
    debug(`userInbox`, userId)
    const inbox = await prisma.commentThread.findFirst({
      where: {
        id: threadId,
        commune: {
          users: {
            some: {
              id : userId
            }
          }
        }
      },
      // @ts-ignore
      include: CommentThreadDetailsInclude
    })
    debug(`userInbox result`, {userId, inbox})
    if (inbox) {
      return inbox as unknown as CommentThreadDetails
    }
    throw {
      code: fileMethod(`userInbox`),
      message: "Unable to obtain inbox for user",
    }
  } catch (error) {
    throw error
  }
}

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
      // @ts-ignore
      include: CommentThreadDetailsInclude
    })
    debug(`userInbox result`, {userId, inbox})
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

const upsertInbox = async ({
  threadId,
  userId,
  partyId,
  messages
}: UpsertInboxProps): Promise<any> => {
  try {
    const thread = await prisma.commentThread.upsert({
      where: {
        id: threadId,
      },
      update: {
        comments: {
          createMany: {
            data: messages?.map(m => { return {...m, threadType: 'INBOX'}}) || []
          }
        }
      },
      create: {
        entity: "INBOX",
        requiredRole: "OWNER",
        comments: {
          createMany: {
            data: messages?.map(m => { return {...m, threadType: 'INBOX'}}) || []
          }
        },
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
        }
      },
      // @ts-ignore
      include: CommentThreadDetailsInclude,
    })
    debug("inbox result", { thread })
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

export const PrismaComment = { threadById, userInbox, upsertInbox }
