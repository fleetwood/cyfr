import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../../hooks/useDebug"
import { User, PrismaUser } from "../../../../prisma/prismaContext"
import { ResponseResult } from "../../../../types/response"
const {debug, err, fileMethod, stringify} = useDebug('api/user/byEmail/[email]')


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User>>
) {
  const email = req.query.email?.toString() || ""
  try {
    const result = await PrismaUser.byEmail(email)
    if (result) {
      debug(`handler`,{email, result})
      res.status(200).json({ result })
    } else {
      throw { code: fileMethod('handler'), message: `No results from Posts.all()` }
    }
  } catch (e) {
    err("fail", e)
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}
