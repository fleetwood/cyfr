import { Post } from ".prisma/client"
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

type PostsResponse = ResponseResult<Post[]>
type PostResponse = ResponseResult<Post>

const byId = async (id:string): Promise<Post|null> => {
  try {
    return await prisma.post.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: {
        author: true,
      },
    })
  } catch (error) {
    throw { code: "posts/byId", message: "No posts were returned!" }
  }
}

const all = async (props?: PostAllProps): Promise<Post[]> => {
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

export const Posts = { all, create, byId }
