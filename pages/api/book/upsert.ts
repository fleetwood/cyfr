import useApiHandler from 'hooks/useApiHandler'
import useDebug from 'hooks/useDebug'
import { NextApiRequest, NextApiResponse } from 'next'
import { BookUpsertProps, PrismaBook } from 'prisma/prismaContext'
const {debug} = useDebug('api/book/upsert', )

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const props: BookUpsertProps = req.body
  debug('request', props)

  return useApiHandler(res,
    'api/book/upsert',
    PrismaBook.upsert(props)
  )
}
export default request
