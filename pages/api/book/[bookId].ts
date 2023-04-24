import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaBook } from "../../../prisma/prismaContext"
const {err, stringify}= useDebug('/api/book/[bookId]')

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookId } = req.query
  try {
    const result = await PrismaBook.detail(bookId as string)
    if (result) {
      res.status(200).json({ result: result })
    } else {
        res.status(200).json({ result: null })
    }
  } catch (e) {
    err("\tFAIL", e)
    res.status(500).json({ error: { code: "api/error", message: stringify(e) } })
  }
}

export default handle