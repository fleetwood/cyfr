import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaPost, PrismaShare } from "../../../prisma/prismaContext"
import { MainFeed, MapToMainFeed } from "../../../prisma/types"
import { ResponseResult } from "../../../types/response"
const {err, stringify}= useDebug('/api/feed/main')

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
    err("FAIL", e)
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
