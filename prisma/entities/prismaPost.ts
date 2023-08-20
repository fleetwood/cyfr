
import useDebug from "hooks/useDebug"
import { Like, Post, PostCreateProps, PostCommentProps, PostDeleteProps, PostDetail, PostEngageProps, PostStub, prisma, PostStubInclude, PostDetailInclude, PrismaShare, Share } from "prisma/prismaContext"
import {PaginationProps} from "types/props"
import { NotImplemented } from "utils/api"
import {PrismaLike} from "./prismaLike"
const {debug, err, info, fileMethod} = useDebug('entities/prismaPost')

const postDetail = async (id: string): Promise<PostDetail> => {
  try {
    debug('postDetail', id)
    return await prisma.post.findUnique({where: {id}, ...PostDetailInclude}) as unknown as PostDetail
  } catch (error) {
    err('postDetail error', {error})
    throw {code: 'prismaPost/postDetail', message: `No post was returned for ${id}`}
  }
}

const feed = async ({take=10, skip=0}:PaginationProps): Promise<PostStub[]> => {
  debug('feed', {PostStubInclude})
  try {
    return await prisma.post.findMany({
      //TODO: blocked users
      where: {visible: true},
      ...PostStubInclude,
      orderBy: {createdAt: "desc"},
      //TODO: pagination
      take, skip
    }) as unknown as PostStub[]
  } catch (error) {
    info('prismaPost.feed ERROR',{error})
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

/**
 * Method references {@link PrismaLike.likePost}
 * Params {@link PostEngageProps}
 * @param creatorId String
 * @param postId String
 * @returns: {@link Like}
 */
const likePost = async (props: PostEngageProps): Promise<Like> => PrismaLike.likePost(props)

/**
 * Method references {@link PrismaShare.sharePost}
 * Params {@link PostEngageProps}
 * @param postId: String
 * @param creatorId: String
 * @returns: {@link Share}
 */
const sharePost = async (props: PostEngageProps): Promise<Share> => PrismaShare.sharePost(props)

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
