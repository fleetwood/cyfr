import { NextApiRequest } from "next"
import { getSession } from "next-auth/react"

const userInSession = async (req: NextApiRequest) => {
  const session = await getSession({ req })
  return session?.user ? true : false
}

export const PrismaSession = { userInSession }
