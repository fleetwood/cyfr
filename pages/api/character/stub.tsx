import useApiHandler from 'hooks/useApiHandler'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaCharacter } from 'prisma/prismaContext'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res, 'api/character/stub', PrismaCharacter.stub(req.body.id))
export default request
