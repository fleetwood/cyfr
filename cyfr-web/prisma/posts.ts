import { Post, User } from ".prisma/client"
import { ResponseResult } from "../types/response"
import { log } from "../utils/log"
import { prisma } from "./prismaContext"

type PostAllProps = {
  take?: number | undefined
  skip?: number | undefined
}

type PostCreateProps = {
  authorid: string,
  title :string,
  subtitle?:string,
  headerImage?:string,
  content: string 
}

type PostEngageProps = {
  postid: string,
  userid: string
}

type PostsResponse = ResponseResult<Post[]>
type PostResponse = ResponseResult<Post>

export type PostWithAuthor = Post & {
  author:User
}

export type PostWithDetails = Post & {
  author:User
  likes: User[]
}

const byId = async (id:string): Promise<PostWithDetails|null> => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
        author: true,
        likes: true
      },
    })
  } catch (error) {
    throw { code: "posts/byId", message: "No posts were returned!" }
  }
}

const all = async (props?: PostAllProps): Promise<PostWithDetails[]> => {
  try {
    const { take = 10, skip = 0 } = { ...props }
    return await prisma.post.findMany({
      take,
      skip,
      where: {
        visible: true,
      },
      include: {
        author: true,
        likes: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    })
  } catch (error) {
    throw { code: "posts/all", message: "No posts were returned!" }
  }
}

const create = async (props:PostCreateProps): Promise<Post> => {
  const data = {...props}
  try {
    log('Posts.create',data)
    return await prisma.post.create({data})
  } catch (error) {
    log('\tERROR: ',error)
    throw { code: "posts/create", message: "Post was not created!" }
  }
}

const like = async (props:PostEngageProps): Promise<Post> => {
  const data = {...props}
  try {
    log('Posts.like',data)
    const user = await prisma.user.findUnique({where: {id: data.userid}})
    const post = await prisma.post.findUnique({where: {id: data.postid}})
    if (user && post) {
      const success = await prisma.post.update({
        where: { id: post.id},
        data: { likes: { connect: {id: user.id}}}
      })
      if (success) {
        return success
      }
      else {
        throw ({
          message: 'Unable to connect like to post'
        })
      }
    }
    throw ({
      message: 'Unable to find user and post to like'
    })
  } catch (error) {
    log('\tERROR: ',error)
    throw { code: "posts/like", message: "Post not liked!" }
  }
}

const share = async (props:PostEngageProps): Promise<Post> => {
  const data = {...props}
  try {
    log('Posts.share',data)
    // const user = await prisma.user.findUnique({where: {id: data.userid}})
    // const post = await prisma.post.findUnique({where: {id: data.postid}})
    // if (user && post) {
    //   const success = await prisma.post.update({
    //     where: { id: post.id},
    //     data: { likes: { connect: {id: user.id}}}
    //   })
    //   if (success) {
    //     return success
    //   }
    //   else {
    //     throw ({
    //       message: 'Unable to connect like to post'
    //     })
    //   }
    // }
    throw ({
      message: 'Not implemented'
    })
  } catch (error) {
    log('\tERROR: ',error)
    throw { code: "posts/share", message: "Post not shared!" }
  }
}

const comment = async (props:PostEngageProps): Promise<Post> => {
  const data = {...props}
  try {
    log('Posts.comment',data)
    // const user = await prisma.user.findUnique({where: {id: data.userid}})
    // const post = await prisma.post.findUnique({where: {id: data.postid}})
    // if (user && post) {
    //   const success = await prisma.post.update({
    //     where: { id: post.id},
    //     data: { likes: { connect: {id: user.id}}}
    //   })
    //   if (success) {
    //     return success
    //   }
    //   else {
    //     throw ({
    //       message: 'Unable to connect like to post'
    //     })
    //   }
    // }
    throw ({
      message: 'Not implemented'
    })
  } catch (error) {
    log('\tERROR: ',error)
    throw { code: "posts/comment", message: "Post not commented!" }
  }
}

export const Posts = { all, create, byId, like, share, comment }
