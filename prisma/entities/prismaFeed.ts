import useDebug from 'hooks/useDebug'
import { LikesSharesInclude, MainFeed, PostDetail, PostStub, PostStubInclude, prisma } from '../prismaContext'
const {debug, err, info, fileMethod} = useDebug('entities/prismaFeed')

const main = async (): Promise<any> => {
  try {
    debug('main')
    // Property '_count' is missing in type 'Post & { [x: string]: never; [x: number]: never; [x: symbol]: never; }' but required in type 'Counts'.ts
    return await prisma.post.findMany({    
      where: {
        visible: true
      },
      include: {
        author: true,
        images: {
          include: {
            _count: {
              select: {
                likes: true,
                shares: true
              }
            }
          }
        },
        commentThread: {
          include: {
            comments: true
          }
        },
        likes: {
          include: {
            author: true
          },
          take: 10
        },
        shares: {
          include: {
            author: true
          },
          take: 10
        },
        _count: {
          select: {
            likes: true,
            shares: true
          } 
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 50,
      skip: 0
    })
  } catch (error) {
    err('postDetail error', {error})
    throw { code: fileMethod('postDetail'), message: "Failed fetching feed" }
  }
}

export const PrismaFeed = { main }
