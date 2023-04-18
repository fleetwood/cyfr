import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { prisma, PrismaPost, PrismaShare } from "../../../prisma/prismaContext"
import { MainFeed, MapToMainFeed } from "../../../prisma/types"
import { ResponseResult } from "../../../types/response"
const {err, stringify, fileMethod}= useDebug('/api/feed/main')

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseResult<MainFeed[]>>) {
  try {
    const posts:[] = await prisma.$queryRaw`select * from f_post_feed(20,0)`
    const shares:[] = await prisma.$queryRaw`select * from f_share_posts(20,0)`
    const result = MapToMainFeed({shares, posts})
    if (result) {
      res.status(200).json({result})
    } else {
      throw { code: fileMethod('handle'), message: `No results` }
    }
  } catch (e) {
    err("FAIL", e)
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
