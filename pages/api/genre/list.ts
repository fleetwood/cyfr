import { NextApiRequest, NextApiResponse } from "next";
import { PrismaGenre } from "../../../prisma/prismaContext";
import { jsonify, logError } from "../../../utils/log";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await PrismaGenre.list();
    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(200).json({ result: null });
    }
  } catch (e) {
    logError("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } });
  }
};

export default handle;
