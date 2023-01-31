import { Post, Posts } from "../../../prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from "next"
import { ResponseResult } from "../../../types/response"
import { jsonify, logError } from "../../../utils/log"

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseResult<Post[]>>) {
  const skip = parseInt(req.query.c ? req.query.c.toString() : "0")
  try {
    const result = await Posts.all()
    if (result) {
      res.status(200).json({result})
    } else {
      throw { code: 'api/post/all', message: `No results from Posts.all()` }
    }
  } catch (e) {
    logError("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } })
  }
}
