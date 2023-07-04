import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "hooks/useDebug"
import { PrismaPost } from "prisma/prismaContext"
const {debug, err} = useDebug('api/post/feed')

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {pg, limit} = req.query
  const skip = pg ? parseInt(pg as string) : 0
  const take = limit ? parseInt(limit as string) : 10
  
  try {
    const result = await PrismaPost.feed({take, skip})
    if (result) {
      debug('result', result)
      res.status(200).json(result)
    } else {
      throw { code: 'api/post/feed', message: `No results from PrismaPost.feed` }
    }
  } catch (e) {
    err("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: 'Post feed failed'} })
  }
}
