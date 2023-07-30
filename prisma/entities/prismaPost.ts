
import useDebug from "hooks/useDebug"
import { Like, Post, PostCreateProps, PostCommentProps, PostDeleteProps, PostDetail, PostEngageProps, PostStub, prisma, PostStubInclude, PostDetailInclude } from "prisma/prismaContext"
import { NotImplemented } from "utils/api"
const {debug, err, info, fileMethod} = useDebug('entities/prismaPost')

const postDetail = async (id: string): Promise<PostDetail> => {
  try {
    debug('postDetail', id)
    return await prisma.post.findUnique({where: {id}, include: PostDetailInclude}) as unknown as PostDetail
  } catch (error) {
    err('postDetail error', {error})
    throw {code: 'prismaPost/postDetail', message: `No post was returned for ${id}`}
  }
}

type PaginationProps = {
  take?: number
  skip?: number
}

const feed = async ({take=10, skip=0}:PaginationProps): Promise<PostStub[]> => {
  debug('feed')
  try {
    return await prisma.post.findMany({
      //TODO: blocked users
      where: {visible: true},
      // TODO: review all stubs and details
      // note that stubs cannot include others stubs in their includes
      include: PostStubInclude,
      orderBy: {createdAt: "desc"},
      //TODO: pagination
      take, skip
    }) as unknown as PostStub[]
  } catch (error) {
    info('prismaPost.feed ERROR',error)
    throw error
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

const likePost = async ({postId, creatorId}: PostEngageProps): Promise<Like> => {
  try {
    debug("likePost", {postId, creatorId})
    return await prisma.like.create({
      data: {postId, creatorId}
    })
  } catch (error) {
    info("likePost ERROR: ", {error, postId, creatorId})
    throw { code: fileMethod('likePost'), ...{error} }
  }
}

/**
 * Params {@link PostEngageProps}
 * @param postId: String
 * @param creatorId: String
 * @returns: {@link Post}
 */
const sharePost = async ({postId,creatorId,}: PostEngageProps): Promise<Post> => {
  debug(`share`, { postId, creatorId })
  try {
    throw NotImplemented('sharePost')
  } catch (error) { 
    info("sharePost ERROR: ", {error, postId, creatorId})
    throw { code: fileMethod('sharePost'), ...{error} }
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

export const PrismaPost = { feed, postDetail, createPost, deletePost, likePost, sharePost, commentOnPost }
