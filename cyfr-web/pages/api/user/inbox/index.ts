import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import useDebug from "../../../../hooks/useDebug"
import { CommentThread, PrismaComment, PrismaUser } from "../../../../prisma/prismaContext"
import { ResponseResult } from "../../../../types/response"
const {debug, info, error} = useDebug({fileName: 'api/user/inbox'})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CommentThread[]>>
) {
  debug('handle')
  try {
    const session = await getSession({ req })
    if (
      session === null ||
      session.user === null ||
      session.user?.email === null
    ) {
      error(`NO USER in session....`,session)
      res.status(200).json({})
      res.end()
      return
    } else {
      debug(`YES USER in session....`,session)
      const email = session?.user?.email
      const user = await PrismaUser.byEmail(email!)
      if (!user) {
        res.status(200).json({})
        res.end()
      }
      const result = await PrismaComment.userInbox(user!.id)
      debug(`result:`, {forUser: user?.id, result})
      res.status(200).json({result})
    }
  } catch (error) {}
}
