import useApiHandler from "hooks/useApiHandler"
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaMembership } from "prisma/prismaContext"

const request = async (req:NextApiRequest, res: NextApiResponse) => useApiHandler(
    res, 'api/membership/types',
    PrismaMembership.types()
)

export default request