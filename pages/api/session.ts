import { NextApiRequest } from "next"
import { getSession } from "next-auth/react"

const handle = async (req: NextApiRequest) => getSession({ req })
export default handle