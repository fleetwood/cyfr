import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaCharacter } from "prisma/prismaContext"

const request = (req:NextApiRequest, res: NextApiResponse) => {
  const {id} = req.body
  return useApiHandler(res,
    'api/character/details',
    PrismaCharacter.detail(id)
  )
}

export default request