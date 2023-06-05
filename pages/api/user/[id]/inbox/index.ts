import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../../../hooks/useDebug"
import { CommentThread, PrismaComment, PrismaUser } from "../../../../../prisma/prismaContext"
import { ResponseResult } from "../../../../../types/response"
const {debug} = useDebug('api/user/inbox')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CommentThread[]>>
) {
  debug('handle')
  try {
    const user = await PrismaUser.userInSessionReq(req)
    if (!user) {
      res.status(200).json({})
      res.end()
    }
    const result = await PrismaComment.userInbox(user!.id)
    debug(`result:`, {forUser: user?.id, result})
    res.status(200).json({result})
  } catch (error) {}
}
