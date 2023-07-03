import { NextApiRequest, NextApiResponse } from "next";
import useDebug from "../../../hooks/useDebug";
import { PrismaGenre } from "../../../prisma/prismaContext";
const {err, stringify} = useDebug('api/genre/stubs')

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await PrismaGenre.details();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ result: null });
    }
  } catch (e) {
    err("\tFAIL", e);
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } });
  }
};

export default handle;
