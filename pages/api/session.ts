import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const handle = async (
  req: NextApiRequest
) => {
  return getSession({ req })
}
export default handle