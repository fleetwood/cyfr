import useApiHandler from 'hooks/useApiHandler'
import useDebug from 'hooks/useDebug'
import {NextApiRequest, NextApiResponse} from 'next'
import {BookCreateProps, PrismaBook} from 'prisma/prismaContext'
const {debug} = useDebug('api/book/create')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  debug('body', req.body.props)

  return useApiHandler(
    res,
    'api/book/create',
    PrismaBook.create(req.body.props as BookCreateProps)
  )
}
export default request
