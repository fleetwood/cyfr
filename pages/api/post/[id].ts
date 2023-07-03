import { NextApiRequest, NextApiResponse } from "next";
import useDebug from "../../../hooks/useDebug";
import { PrismaPost } from "../../../prisma/entities/prismaPost";
const {err, stringify} = useDebug('api/post/[id]')

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const result = await PrismaPost.postDetail(id?.toString() || "");
    if (result) {
      res.status(200).json(result);
    } else {
      throw { code: "api/post", message: `No results from Post.byId()` };
    }
  } catch (e) {
    err("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } });
  }
};

export default handle