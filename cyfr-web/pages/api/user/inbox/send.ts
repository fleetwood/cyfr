import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import useDebug from "../../../../hooks/useDebug"
import { CommentThread, PrismaComment, PrismaUser } from "../../../../prisma/prismaContext"
import { ResponseResult } from "../../../../types/response"
const {debug, info, error} = useDebug({fileName: 'api/user/inbox/send'})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CommentThread[]>>
) {
  debug('handle')
  try {
    const session = await getSession({ req })
    if (
      session === null ||
      session.user === null
    ) {
      error(`NO USER in session....`,session)
      res.status(200).json({})
      res.end()
      return
    } else {
      const { threadId, userId, partyId, messages} = req.body.body
      const result = await PrismaComment.upsertInbox({threadId, userId, partyId, messages})
      debug(`result:`, {userId, partyId, messages, result})
      res.status(200).json({result})
    }
  } catch (e) {
    error(`Failed to send message`, {e})
    throw(e)
  }
}
