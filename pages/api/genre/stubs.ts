import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
import { PrismaGenre } from "prisma/prismaContext"
const {debug, err, stringify} = useDebug('api/genre/stubs')

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await PrismaGenre.stubs()
    if (result) {
      debug('result', result)
      res.status(200).json(result)
    } else {
      debug('result', result)
      res.status(200).json({ result: null })
    }
  } catch (e) {
    debug("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: e } })
  }
}

export default handle
