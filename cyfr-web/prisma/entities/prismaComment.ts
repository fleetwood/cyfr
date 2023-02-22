import { CommentThreadDetailsInclude, InboxProps } from "../prismaContext"

const userInbox = async (userId:string):Promise<any[]> => {
    try {
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
        include: CommentThreadDetailsInclude
      })
      if (inbox) {
        return inbox
      }
      throw({code: 'prismaUser.userInbox', message: 'Unable to obtain inbox for user'})
    } catch (error) {
      throw error
    }
  }
  
  const inbox = async ({threadId, userId, partyId}:InboxProps):Promise<any> => {
    try {
      const thread = await prisma.commentThread.upsert({
        where: {
          id: threadId
        },
        update: {},
        create: {
          entity: 'INBOX',
          requiredRole: 'PRIVATE',
          commune: {
            create: {
              entity: 'INBOX',
              ownerId: userId,
              users: {
                createMany: 
                  {data: [
                    {userId: userId, role: 'OWNER'},
                    {userId: partyId, role: 'OWNER'},
                  ]}
              }
            }
          }
        },
        include: CommentThreadDetailsInclude
      })
      if (thread) {
        return thread
      }
      throw({code: 'prismaUser.inbox', message: 'Unable to find or create inbox'})
    } catch (error) {
      throw error
    }
  }
  

export const PrismaComment = { userInbox, inbox }