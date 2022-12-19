import { Post } from ".prisma/client";
import { GetResponseError, ResponseResult } from "../types/Response";
import { jsonify } from "../utils/log";
import { prisma } from "./prismaContext";

type PostAllProps = {
  take?: number | undefined;
  skip?: number | undefined;
};

type PostResponse = ResponseResult<Post[]>;

const all = async (props?: PostAllProps): Promise<PostResponse> => {
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
      return { result: JSON.parse(jsonify(results)) };
    }
    throw { code: "posts/all", message: "No posts were returned!" };
  } catch (error) {
    return { error: GetResponseError(error) };
  }
};

export const Posts = { all };
