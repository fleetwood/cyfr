import { NextApiRequest, NextApiResponse } from "next";
import { PrismaChat } from "../../../../prisma/entities/prismaChat";
import { GetResponseError } from "../../../../types/response";
import { log, logError } from "../../../../utils/log";

export default async function sendMessage(req: NextApiRequest,res: NextApiResponse) {
  try {
    const message = req.body.body
    // log(`api/chat/message/send ${JSON.stringify({req: req.body.body, message})}`)
    const result = await PrismaChat.sendMessage(message);

    if (result) {
      // log(`api/chat/message/send result ${JSON.stringify(result, null, 2)}`);
      res.status(200).json({ result });
    }
    
  } catch (e: Error | any) {
    logError(`api/chat/message/send FAIL`, e);
    const error = GetResponseError(e);
    res.status(200).json({ error });
  }
}
