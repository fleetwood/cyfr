
import useDebug from "hooks/useDebug"
import { Like, Post, PostCreateProps, PostCommentProps, PostDeleteProps, PostDetail, PostEngageProps, PostStub, prisma, PostStubInclude } from "prisma/prismaContext"
const {debug, err, info, fileMethod} = useDebug('entities/prismaPost', 'DEBUG')

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

const all = async (): Promise<PostStub[]> => {
  debug('all', PostStubInclude)
  try {
    const posts =  await prisma.post.findMany({
      //TODO: blocked users
      where: {visible: true},
      // TODO: review all stubs and details
      // note that stubs cannot include others stubs in their includes
      include: PostStubInclude,
      orderBy: {createdAt: "desc"},
      //TODO: pagination
      take: 10
    })
    return posts as unknown as PostStub[]
  } catch (error) {
    info('prismaPost.all',error)
    throw { code: fileMethod('all'), message: "No posts were returned!" }
  }
}

const createPost = async (props: PostCreateProps): Promise<Post> => {
  const {content, creatorId, images} = props
  const data = {
    creator: {
      connect: {
        id: creatorId
      }
    },
    content, 
    images: {
      connect: images?.filter(i => i!==null).map(i => {return {id: i.id}}) ?? []
    },
    commentThread: {
      create: {}
    }
  }

  try {
    debug('createPost', {data})
    return await prisma.post.create({ data })
  } catch (error) {
    info("createPost ERROR: ", error)
    throw { code: fileMethod("createPost"), message: "Post was not created!" }
  }
}

const deletePost = async ({postId, creatorId}: PostDeleteProps): Promise<Post> => {
  try {
    debug("deletePost", {postId, creatorId})
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


const commentOnPost = async (props: PostCommentProps): Promise<PostDetail> => {
  const {postId, creatorId, content} = props
  try {
    debug("commentonPost", {...props})
    const post = await prisma.post.findFirst({
      where: {id: postId},
      include: { commentThread: {
        include: {
          comments: true
        }
      }}
    })
    if (post) {
      if (post.commentThreadId !== undefined) {
        const thread = await prisma.commentThread.update({
          where: {id: post.commentThreadId!},
          data: {
            comments: {
              create: {
                content,
                creatorId
              }
            }
          }
        })
        if (thread) return postDetail(postId!)
      } else {
        const thread = await prisma.commentThread.create({
          data: {
            post: {
              connect: {id: post.id}
            },
            comments: {
              create: {
                content,
                creatorId
              }
            }
          }
        })
        if (thread) return postDetail(postId!)
      }
    }
    throw ({message: 'Unable to comment on post'})
  } catch (error) {
    info("commentOnPost ERROR: ", error)
    throw { code: fileMethod("commentOnPost"), message: "Post not commented!" }
  }
}

export const PrismaPost = { all, postDetail, createPost, deletePost, likePost, commentOnPost }
