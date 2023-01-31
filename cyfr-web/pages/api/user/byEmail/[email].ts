import { User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { Users } from "../../../../prisma/entities/user.entity"

import { ResponseResult } from "../../../../types/response"
import { logError, jsonify, log } from "../../../../utils/log"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User>>
) {
  const email = req.query.email?.toString() || ""
  try {
    const result = await Users.byEmail(email)
    if (result) {
      log(`api/user/byEmail(
        ${email},
        ${JSON.stringify(result, null, 2)}
      )`)
      res.status(200).json({ result })
    } else {
      throw { code: "api/post", message: `No results from Posts.all()` }
    }
  } catch (e) {
    logError("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } })
  }
}
