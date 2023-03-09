import { NextApiRequest, NextApiResponse } from "next";
import { PrismaGenre } from "../../../prisma/prismaContext";
import { jsonify, logError } from "../../../utils/log";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query;
  try {
    const result = await PrismaGenre.byTitle(title?.toString() || "");
    if (result[0]) {
      res.status(200).json({ result: result[0] });
    } else {
        res.status(200).json({ result: null });
    }
  } catch (e) {
    logError("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: jsonify(e) } });
  }
};

export default handle