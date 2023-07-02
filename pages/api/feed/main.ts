import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "hooks/useDebug"
import { MainFeed, PostStub, PrismaPost, prisma } from "prisma/prismaContext"

const {debug, err, fileMethod}= useDebug('/api/feed/main')

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  debug('handle')
  try {
    const result = await PrismaPost.all()
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
