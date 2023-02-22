import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { CommentThread, PrismaComment, PrismaUser } from "../../../../prisma/prismaContext";
import { ResponseResult } from "../../../../types/response";
import { todo } from "../../../../utils/log";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CommentThread>>
) {
  try {
    const session = await getSession({ req });
    const {partyId, userId, threadId} = req.body.body
    
    if (
      session === null ||
      session.user === null ||
      session.user?.email === null
    ) {
      // log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nNO USER in session.... ${JSON.stringify(session, null, 2)}`)
      res.status(200).json({});
      res.end();
      return;
    } else {
      // log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nYES USER in session.... ${JSON.stringify(session, null, 2)}`)
      todo('This should only get inbox that the user is included in')
      const result = PrismaComment.inbox({partyId, userId, threadId}) as unknown as CommentThread
      if (!result) {
        res.status(200).json({});
        res.end();
      }
      res.status(200).json({ result });
    }
  } catch (error) {}
}
