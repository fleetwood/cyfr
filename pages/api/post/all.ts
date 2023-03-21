import { Post, PrismaPost } from "../../../prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from "next"
import { ResponseResult } from "../../../types/response"
import useDebug from "../../../hooks/useDebug"
const {stringify, todo, err} = useDebug('api/post/all')

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseResult<Post[]>>) {
  todo('handler','Pagination')
  const skip = parseInt(req.query.c ? req.query.c.toString() : "0")
  try {
    const result = await PrismaPost.all()
    if (result) {
      res.status(200).json({result})
    } else {
      throw { code: 'api/post/all', message: `No results from PrismaPost.frag()` }
    }
  } catch (e) {
    err("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: stringify({e}) } })
  }
}
