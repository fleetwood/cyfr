import { PostCommentProps, PostCreateProps, PostDetail, PostEngageProps, PostFeed, Post, User, PostDeleteProps } from "../prismaContext"
import { log } from "../../utils/log"

const fileName = 'prismaPost'
const fileMethod = (method:string) => `${fileName}.${method}`
const trace = (method:string, t?:any) => log(fileMethod(method)+t?' '+JSON.stringify(t,null,2) :'')

const byId = async (id: string): Promise<PostDetail | null> => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
       author: true,
       shares: true,
       likes: true,
       post_comments: true
      },
    })
  } catch (error) {
    throw { code: "posts/byId", message: "No posts were returned!" }
  }
}

/**
 * @satisfies visible:true
 * @satisfies commentId:null //don't include Shares
 * @returns PostFeed[]
 */
const all = async (): Promise<PostFeed[] | []> => {
  trace('all')
  try {
    return await prisma.post.findMany({
      where: {
        visible: true,
        commentId: null
      },
      include: {
        author: true,
        shares: { include: {
            author: true,
        }},
        likes: { include: {
          author: true,
        }},
        post_comments: {
          include: {
            author: true,
            shares: { include: {
              author: true,
            }},
            likes: { include: {
              author: true,
            }}
          }
        }
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    }) as unknown as PostFeed[]
  } catch (error) {
    throw { code: "posts/all", message: "No posts were returned!" }
  }
}

const createPost = async (props: PostCreateProps): Promise<Post> => {
  const data = { ...props }
  try {
    trace('createPost', data)
    return await prisma.post.create({ data })
  } catch (error) {
    trace("\tcreatePost ERROR: ", error)
    throw { code: "posts/create", message: "Post was not created!" }
  }
}

const deletePost = async ({postId, authorId}: PostDeleteProps): Promise<Post> => {
  try {
    trace("deletePost", {postId, authorId})
    return await prisma.post.update({ 
      where: {
        id: postId,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    trace("deletePost ERROR: ", error)
    throw { code: "posts/create", message: "Post was not created!" }
  }
}

const likePost = async (props: PostEngageProps): Promise<Post> => {
  const data = { ...props }
  try {
    trace("likePost", data)
    const user = await prisma.user.findUnique({ where: { id: data.authorId } })
    const post = await prisma.post.findUnique({ where: { id: data.postId } })
    if (user && post) {
      log(`Found ${JSON.stringify({
        userId: user.id,
        postId: post.id
      })}`)
      const success = await prisma.post.update({
        where: { id: post.id },
        data: { 
          likes: { 
            create: {
              authorId: user.id,
            }
          } 
        },
      })
      if (success) {
        return success
      } else {
        throw new Error("Unable to connect like to post")
      }
    }
    throw new Error("Unable to find user and post to like")
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: fileMethod('createPost'), ...{error} }
  }
}

const sharePost = async (props: PostEngageProps): Promise<Post> => {
  const { authorId, postId } = props
  try {
    log("Posts.share", props)
    const post = await prisma.post.findUnique({ where: { id: postId } })

    const newShare = await prisma.share.create({
      data: {
        authorId,
        postId
      },
    })
    const updatePost = await prisma.post.update({
      where: { id: postId },
      data: {
        shares: {
          connect: {
            id: newShare.id,
          },
        },
      },
    })
    return updatePost
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: "posts/share", message: "Post not shared!" }
  }
}

const commentOnPost = async (props: PostCommentProps): Promise<Post> => {
  const {commentId, authorId, content} = props
  try {
    log("Posts.comment", {...props})
    const success = await prisma.post.create({
      data: {
        authorId,
        commentId,
        content
      }
    })
    if (success) {
      return success
    }
    else {
      throw ({
        message: 'Unable to comment on post'
      })
    }
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: "posts/comment", message: "Post not commented!" }
  }
}

export const PrismaPost = { all, byId, createPost, deletePost, likePost, sharePost, commentOnPost }
