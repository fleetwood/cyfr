import { NextApiRequest, NextApiResponse } from "next";
import { PrismaPost } from "../../../prisma/entities/prismaPost";
import { jsonify, logError } from "../../../utils/log";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const result = await PrismaPost.byId(id?.toString() || "");
    if (result) {
      res.status(200).json({ result });
    } else {
      throw { code: "api/post", message: `No results from Post.byId()` };
    }
  } catch (e) {
    logError("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } });
  }
};

export default handle