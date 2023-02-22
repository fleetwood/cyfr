import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import useDebug from "../../../../hooks/useDebug";
import { CommentThread, PrismaComment, PrismaUser } from "../../../../prisma/prismaContext";
import { ResponseResult } from "../../../../types/response";
const [debug] = useDebug('api/user/inbox', 'DEBUG')

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
      debug(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\nNO USER in session....`,session)
      res.status(200).json({});
      res.end();
      return;
    } else {
      debug(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nYES USER in session....`,session)
      const email = session?.user?.email;
      const user = await PrismaUser.byEmail(email!)
      if (!user) {
        res.status(200).json({});
        res.end();
      }
      const result = await PrismaComment.userInbox(user!.id)
      debug(`result:`, {result, forUser: user?.id})
      res.status(200).json({ result });
    }
  } catch (error) {}
}
