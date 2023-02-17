import { NextApiRequest, NextApiResponse } from "next";
import { PrismaChat } from "../../../prisma/entities/prismaChat";
import { GetResponseError } from "../../../types/response";
import { log, logError } from "../../../utils/log";

export default async function UpdateChat(req: NextApiRequest,res: NextApiResponse) {
  try {
    const users = req.body.body.users
    const result = await PrismaChat.connectToChat({ users });

    if (result) {
      log(`api/chat/connect result ${JSON.stringify(result, null, 2)}`);
      res.status(200).json({ result });
    }
  } catch (e: Error | any) {
    logError(`api/chat/connect FAIL`, e);
    const error = GetResponseError(e);
    res.status(200).json({ error });
  }
}
