import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Users } from "../../../../prisma/users";

import { ResponseResult } from "../../../../types/response";
import { logError, jsonify } from "../../../../utils/log";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse<ResponseResult<User>>
) {
  const email = req.query.email?.toString() || "";
  try {
    const result = await Users.byEmail(email);
    if (result) {
      res.status(200).json({ result });
    } else {
      throw { code: "api/post", message: `No results from Posts.all()` };
    }
  } catch (e) {
    logError("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } });
  }
}
