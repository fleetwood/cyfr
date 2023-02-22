import { NextApiRequest, NextApiResponse } from "next";
import useDebug from "../../../hooks/useDebug";
import { User, PrismaUser } from "../../../prisma/prismaContext";

import { GetResponseError, ResponseError, ResponseResult } from "../../../types/response";
const [debug, warn, todo] = useDebug('api/user/preferences')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User>>
) {
  todo('Why is this posting req.body.body????')
  debug("handle", req.body.body)
  try {
    const { id, name, image } = req.body.body
    const result = await PrismaUser.updatePreferences({id, name, image});
    if (result) {
      debug("got result!!")
      res.status(200).json({ result });
    } else {
      debug("no result!!")
      throw { code: "api/user/preferences", message: `No results from Users.updatePreferences` };
    }
  } catch (e: Error | ResponseError | any) {
    warn("FAIL", e)
    const error = GetResponseError(e)
    res.status(500).json({ error })
  }
}