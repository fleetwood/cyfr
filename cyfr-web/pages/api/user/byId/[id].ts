import { NextApiRequest, NextApiResponse } from "next"

import { ResponseResult } from "../../../../types/response"
import { logError, jsonify } from "../../../../utils/log"
import { UserDetail } from "../../../../prisma/types/user"
import { Users } from "../../../../prisma/users"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<UserDetail>>
) {
  const id = req.query.id?.toString() || ""
  try {
    const result = await Users.byId(id)
    if (result) {
      res.status(200).json({ result })
    } else {
      throw { code: "api/user/byId", message: `No results (${id})` }
    }
  } catch (e) {
    logError("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } })
  }
}
