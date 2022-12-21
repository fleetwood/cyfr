import { Post } from ".prisma/client";
import { GetResponseError, ResponseResult } from "../types/Response";
import { cleanResult } from "../utils/api";
import { prisma } from "./prismaContext";

type PostAllProps = {
  take?: number | undefined;
  skip?: number | undefined;
};

type PostCreateProps = {
  authorid: string,
  title :string,
  subtitle?:string,
  headerImage?:string,
  content: string 
}

type PostsResponse = ResponseResult<Post[]>;
type PostResponse = ResponseResult<Post>;

const all = async (props?: PostAllProps): Promise<PostsResponse> => {
  try {
    const { take = 10, skip = 0 } = { ...props };
    const results = await prisma.post.findMany({
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
    });
    if (results) {
      return cleanResult(results)
    }
    throw { code: "posts/all", message: "No posts were returned!" };
  } catch (error) {
    return { error: GetResponseError(error) };
  }
};

const create = async (props:PostCreateProps): Promise<PostResponse> => {
  const data = {...props}
  try {
    const result = await prisma.post.create({data});
    if (result) {
      return cleanResult(result)
    }
    throw { code: "posts/create", message: "Post was not created!" };
  } catch (error) {
    return { error: GetResponseError(error) };
  }
}

export const Posts = { all, create };
