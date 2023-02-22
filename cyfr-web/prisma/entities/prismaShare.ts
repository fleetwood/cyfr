import { log } from "../../utils/log"
import { Share, ShareDeleteProps, ShareFeed } from "../prismaContext"

const byId = async (id: string): Promise<Share | null> => {
  try {
    return await prisma.share.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
       author: true,
       post: true
      },
    })
  } catch (error) {
    throw { code: "prismaShare.byId()", message: "No share was returned!" }
  }
}

/**
 * @satisfies visible:true
 * @satisfies commentId:null //don't include Shares
 * @returns PostFeed[]
 */
const all = async (): Promise<ShareFeed[] | []> => {
  try {
    return await prisma.share.findMany({
      where: {
        visible: true
      },
      include: {
        author: true,
        post: {
          include: {
            author: true,
            post_comments: {
              include: {
                author: true
              }
            },
            shares: true,
            likes: true,
            images: true
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }) as unknown as ShareFeed[]
  } catch (error) {
    throw { code: "prismaShare.all", message: "No shares were returned!" }
  }
}

// const createPost = async (props: PostCreateProps): Promise<Post> => {
//   const data = { ...props }
//   try {
//     log("Posts.create", data)
//     return await prisma.post.create({ data })
//   } catch (error) {
//     log("\tERROR: ", error)
//     throw { code: "posts/create", message: "Post was not created!" }
//   }
// }

const deleteShare = async ({id, authorId}: ShareDeleteProps): Promise<Share> => {
  try {
    log("PrismaShare.deleteShare", {id, authorId})
    return await prisma.share.update({ 
      where: {
        id,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: "posts/create", message: "Post was not created!" }
  }
}

// const likePost = async (props: PostEngageProps): Promise<Post> => {
//   const data = { ...props }
//   try {
//     log("Posts.like", data)
//     const user = await prisma.user.findUnique({ where: { id: data.authorId } })
//     const post = await prisma.post.findUnique({ where: { id: data.postId } })
//     if (user && post) {
//       const success = await prisma.post.update({
//         where: { id: post.id },
//         data: { likes: { connect: { id: user.id } } },
//       })
//       if (success) {
//         return success
//       } else {
//         throw {
//           message: "Unable to connect like to post",
//         }
//       }
//     }
//     throw {
//       message: "Unable to find user and post to like",
//     }
//   } catch (error) {
//     log("\tERROR: ", error)
//     throw { code: "posts/like", message: "Post not liked!" }
//   }
// }

// const sharePost = async (props: PostEngageProps): Promise<Post> => {
//   const { authorId, postId } = props
//   try {
//     log("Posts.share", props)
//     const post = await prisma.post.findUnique({ where: { id: postId } })

//     const newShare = await prisma.share.create({
//       data: {
//         authorId,
//         postId
//       },
//     })
//     const updatePost = await prisma.post.update({
//       where: { id: postId },
//       data: {
//         shares: {
//           connect: {
//             id: newShare.id,
//           },
//         },
//       },
//     })
//     return updatePost
//   } catch (error) {
//     log("\tERROR: ", error)
//     throw { code: "posts/share", message: "Post not shared!" }
//   }
// }

// const commentOnPost = async (props: PostCommentProps): Promise<Post> => {
//   const {commentId, authorId, content} = props
//   try {
//     log("Posts.comment", {...props})
//     const success = await prisma.post.create({
//       data: {
//         authorId,
//         commentId,
//         content
//       }
//     })
//     if (success) {
//       return success
//     }
//     else {
//       throw ({
//         message: 'Unable to comment on post'
//       })
//     }
//   } catch (error) {
//     log("\tERROR: ", error)
//     throw { code: "posts/comment", message: "Post not commented!" }
//   }
// }

export const PrismaShare = { all, byId, deleteShare }
