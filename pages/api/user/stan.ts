import { NextApiRequest, NextApiResponse } from "next"
import { Follow, PrismaUser } from "../../../prisma/prismaContext"

import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response"
import { logError, todo } from "../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Follow>>
) {
  todo('Why is this posting req.body.body????')
  const { followerId, followingId, isFan = true } = req.body.body
  try {
    const result = await PrismaUser.follow({followerId, followingId, isFan})
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/stan", message: `No results from Stan` }
    }
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/stan", message: "Failed to create Fan" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}