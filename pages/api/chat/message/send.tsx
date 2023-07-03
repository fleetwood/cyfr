import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../../hooks/useDebug"
import { PrismaChat } from "../../../../prisma/entities/prismaChat"
import { GetResponseError } from "../../../../types/response"

const {debug, info} = useDebug("api/chat/message/send")

export default async function sendMessage(req: NextApiRequest,res: NextApiResponse) {
  try {
    const message = req.body
    debug(`sendMessage`,{req: req.body, message})
    const result = await PrismaChat.sendMessage(message)

    if (result) {
      res.status(200).json(result)
    }
    
  } catch (e: Error | any) {
    info(`sendMessage FAIL`, e)
    const error = GetResponseError(e)
    res.status(200).json({ error })
  }
}
