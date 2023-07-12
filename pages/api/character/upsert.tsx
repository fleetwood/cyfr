import useApiHandler from 'hooks/useApiHandler'
import { PrismaCharacter } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

const request = (req:NextApiRequest, res: NextApiResponse) => useApiHandler(res,
  'api/character/upsert',
  PrismaCharacter.upsert(req.body.character)
)

export default request
