import { Post, PostFeed, PrismaPost, PrismaShare, Share, ShareFeed } from "../../../prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from "next"
import { ResponseResult } from "../../../types/response"
import { jsonify, logError } from "../../../utils/log"
import { MainFeed, MapToMainFeed } from "../../../prisma/types"

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseResult<MainFeed[]>>) {
  try {
    const posts = await PrismaPost.all()
    const shares = await PrismaShare.all()
    const result = MapToMainFeed({shares, posts})
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
