import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { CommentThread, PrismaComment, PrismaUser } from "../../../../prisma/prismaContext";
import { ResponseResult } from "../../../../types/response";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<CommentThread[]>>
) {
  try {
    const session = await getSession({ req });
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
      const email = session?.user?.email;
      const user = await PrismaUser.byEmail(email!)
      if (!user) {
        res.status(200).json({});
        res.end();
      }
      const result = await PrismaComment.userInbox(user!.id) as unknown as CommentThread[]
      res.status(200).json({ result });
    }
  } catch (error) {}
}
