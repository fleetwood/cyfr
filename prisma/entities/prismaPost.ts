import useDebug from "../../hooks/useDebug"
import { prisma, Like, Post, PostCommentProps, PostCreateProps, PostDeleteProps, PostDetail, PostEngageProps, PostStub } from "../prismaContext"
const {debug, err, info, fileMethod} = useDebug('entities/prismaPosts')

const postDetail = async (id: string): Promise<PostDetail> => {
  try {
    debug('postDetail', id)
    const result:any[] = await prisma.$queryRaw`select * from f_post_detail(${id})`
    if (result) {
      return result[0] as PostDetail
    }
    else {
      debug('postDetail NAWP', {result})
    }
    // throw {code: fileMethod('postDetail'), message: 'No post was returned'}
    return {} as PostDetail
  } catch (error) {
    err('postDetail error', {error})
    throw { code: fileMethod('postDetail'), message: "Failed fetching post" }
  }
}

/**
 * @satisfies visible:true
 * @satisfies commentId:null //don't include Shares
 * @returns PostFeed[]
 */
const all = async (): Promise<any> => {
  debug('all')
  try {
    const posts =  await prisma.$queryRaw`select * from f_post_feed()`;
    return posts as unknown as PostStub[]
  } catch (error) {
    throw { code: fileMethod('all'), message: "No posts were returned!" }
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
    debug('createPost', data)
    return await prisma.post.create({ data })
  } catch (error) {
    info("createPost ERROR: ", error)
    throw { code: fileMethod("createPost"), message: "Post was not created!" }
  }
}

const deletePost = async ({postId, authorId}: PostDeleteProps): Promise<Post> => {
  try {
    debug("deletePost", {postId, authorId})
    return await prisma.post.update({ 
      where: {
        id: postId,
      },
      data: {
        visible: false
      }
    })
  } catch (error) {
    info("deletePost ERROR: ", error)
    throw { code: fileMethod("deletePost"), message: "Post was not deleted!" }
  }
}

const likePost = async (props: PostEngageProps): Promise<Like> => {
  const data = { ...props }
  try {
    debug("likePost", data)
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
    info("likePost ERROR: ", error)
    throw { code: fileMethod('likePost'), ...{error} }
  }
}

const sharePost = async (props: PostEngageProps): Promise<Post> => {
  const { authorId, postId } = props
  try {
    debug("sharePost", props)
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
    info("sharePost ERROR: ", error)
    throw { code: fileMethod("sharePost"), message: "Post not shared!" }
  }
}

const commentOnPost = async (props: PostCommentProps): Promise<Post> => {
  const {commentId, authorId, content} = props
  try {
    debug("commentonPost", {...props})
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
    info("commentOnPost ERROR: ", error)
    throw { code: fileMethod("commentOnPost"), message: "Post not commented!" }
  }
}

export const PrismaPost = { all, postDetail, createPost, deletePost, likePost, sharePost, commentOnPost }
