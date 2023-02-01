import { NextApiRequest, NextApiResponse } from "next";
import { User, PrismaUser } from "../../../prisma/prismaContext";

import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response";
import { log, logError, todo } from "../../../utils/log";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User>>
) {
  todo('Why is this posting req.body.body????')
  log("\tapi/user/preferences", JSON.stringify(req.body.body))
  try {
    const { id, name, image } = req.body.body
    const result = await PrismaUser.updatePreferences({id, name, image});
    if (result) {
      log("\tapi/user/preferences result!!")
      res.status(200).json({ result });
    } else {
      log("\tapi/user/preferences no result!!")
      throw { code: "api/user/preferences", message: `No results from Users.updatePreferences` };
    }
  } catch (e: Error | ResponseError | any) {
    logError("\tFAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}