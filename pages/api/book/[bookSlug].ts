import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../../hooks/useDebug"
import { PrismaBook } from "../../../prisma/prismaContext"

const filename = "/api/book/details"
const { err, stringify } = useDebug(filename)

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookSlug }: { bookSlug?: string } = req.query
  try {
    const result = await PrismaBook.detail({slug: bookSlug})
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(200).json({ result: null })
    }
  } catch (e) {
    err("\tFAIL", e)
    res.status(500).json({ code: filename, message: stringify(e) })
  }
}

export default handle
