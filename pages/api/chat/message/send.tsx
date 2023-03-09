import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../../hooks/useDebug"
import { PrismaChat } from "../../../../prisma/entities/prismaChat"
import { GetResponseError } from "../../../../types/response"

const {debug, info} = useDebug({fileName: "api/chat/message/send"})

export default async function sendMessage(req: NextApiRequest,res: NextApiResponse) {
  try {
    const message = req.body.body
    debug(`sendMessage`,{req: req.body.body, message})
    const result = await PrismaChat.sendMessage(message)

    if (result) {
      // log(`api/chat/message/send result ${JSON.stringify(result, null, 2)}`)
      res.status(200).json({ result })
    }
    
  } catch (e: Error | any) {
    info(`sendMessage FAIL`, e)
    const error = GetResponseError(e)
    res.status(200).json({ error })
  }
}
