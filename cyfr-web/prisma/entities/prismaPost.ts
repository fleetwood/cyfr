import { log } from "../../utils/log"
import { Like, Post, PostCommentProps, PostCreateProps, PostDeleteProps, PostDetail, PostEngageProps, PostFeed, PostFeedInclude } from "../prismaContext"

const fileName = 'prismaPost'
const fileMethod = (method:string) => `${fileName}.${method}`
const trace = (method:string, t?:any) => log(fileMethod(method)+t?' '+JSON.stringify(t,null,2) :'')

const byId = async (id: string): Promise<PostDetail | null> => {
  try {
    const result = await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
        author: { include: {
          posts: true,
          likes: true,
          following: true,
          follower: true,
          fans: true,
          fanOf: true,
        }},
        post_comments: { include: {
          author: true,
          comment: true,
          images: true,
          post_comments: { include: { author: true } },
          likes: { include: { author: true } },
          shares: { include: { author: true } },
        } },
        likes: { include: { author: true } },
        shares: { include: { author: true } },
        images: { include: {
          author: true,
          likes: true,
          shares: true,
          gallery: true,
          post: true
        } },
      },
    })
    if (result) {
      return result as unknown as PostDetail
    }
    throw {code: fileMethod('prismaPost.byId'), message: 'Failed fetching post'}
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
      include: PostFeedInclude,
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
  const {content, authorId, images} = { ...props }
  const imageData = images && images.length>0 ? {
      createMany: { data: [
        images.forEach(url => {return {authorId, url}})
      ]}
  }:null
  
  const data = {
    authorId, 
    content, 
    images: {
      createMany: {data: 
        images===undefined
          ?[]
          :images.map(url => {return {authorId, url}})
    }}
  }

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

const likePost = async (props: PostEngageProps): Promise<Like> => {
  const data = { ...props }
  try {
    trace("likePost", data)
    const success = await prisma.like.create({
      data: {...props}
    })
    if (success) {
      return success
    } else {
      throw new Error("Unable to connect like to post")
    }
    throw new Error("Unable to find user and post to like")
  } catch (error) {
    log("\tERROR: ", error)
    throw { code: fileMethod('likePost'), ...{error} }
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
