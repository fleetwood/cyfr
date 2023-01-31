import { Fan, Follow } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Users } from "../../../prisma/entities/user.entity";

import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response";
import { logError, jsonify, todo } from "../../../utils/log";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<Follow>>
) {
  todo('Why is this posting req.body.body????')
  const { following, follower } = req.body.body
  try {
    const result = await Users.follow(following, follower);
    if (result) {
      res.status(200).json({ result });
    } else {
      throw { code: "api/user/follow", message: `No results from Follow` };
    }
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/follow", message: "Failed to create Follower" }
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}