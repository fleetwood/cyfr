import { Fan, Follow, PrismaUser } from "../../../prisma/prismaContext"
import { NextApiRequest, NextApiResponse } from "next"

import {
  GetResponseError,
  ResponseError,
  ResponseResult,
} from "../../../types/response"
import useDebug from "../../../hooks/useDebug"
const { todo, err } = useDebug("api/user/follow")

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Follow>>
) {
  todo('handle',"Why is this posting req.body.body????")
  const { following, follower } = req.body.body
  try {
    const result = await PrismaUser.follow(following, follower)
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/follow", message: `No results from Follow` }
    }
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/follow", message: "Failed to create Follower" }
    }
  } catch (e: Error | ResponseError | any) {
    err("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}
