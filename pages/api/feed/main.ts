import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { MainFeed, prisma } from "../../../prisma/prismaContext"

import { ResponseResult } from "../../../types/response"
const {debug, err, fileMethod}= useDebug('/api/feed/main', 'DEBUG')

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseResult<MainFeed[]>>) {
  debug('handle')
  try {
    const result = await prisma.$queryRaw`select * from v_feed_main`
    if (result) {
      res.status(200).json(result)
    } else {
      throw { code: fileMethod('handle'), message: `No results` }
    }
  } catch (e) {
    err("FAIL", e)
    res.status(500).json({ error: { code: "api/error", message: 'Failed obtaining main feed' } })
  }
}
