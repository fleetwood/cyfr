import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaChat } from "../../../prisma/entities/prismaChat"
import { GetResponseError } from "../../../types/response"
const [debug, warn] = useDebug("api/chat/connect")

export default async function ConnectToChat(req: NextApiRequest,res: NextApiResponse) {
  try {
    const users = req.body.body.users
    debug(`ConnectToChat`,users)
    const result = await PrismaChat.connectToChat({ users })

    if (result) {
      debug(`ConnectToChat result`,result)
      res.status(200).json({ result })
    }
  } catch (e: Error | any) {
    warn(`FAIL`, e)
    const error = GetResponseError(e)
    res.status(200).json({ error })
  }
}
