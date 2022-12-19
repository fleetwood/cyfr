import { NextApiRequest, NextApiResponse } from "next";
import { Posts } from "../../../prisma/posts";
import { jsonify, logError } from "../../../utils/log";

export async function handle(req: NextApiRequest, res: NextApiResponse) {
  const skip = parseInt(req.query.c ? req.query.c.toString() : "0");
  try {
    const results = await Posts.all({take:50,skip});
    if (results) {
      res.status(200).json(jsonify(results));
    }
    throw { code: 'api/post', message: `No results from Posts.all()` };
  } catch (e) {
    logError("\tFAIL", e);
    res.status(300).json({ error: { code: "api/error", message: jsonify(e) } });
  }
}
