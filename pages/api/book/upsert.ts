import useApiHandler from 'hooks/useApiHandler'
import useDebug from 'hooks/useDebug'
import {NextApiRequest, NextApiResponse} from 'next'
import {PrismaBook} from 'prisma/prismaContext'
const {debug} = useDebug('api/book/upsert', 'DEBUG')

const request = async (req:NextApiRequest, res: NextApiResponse) => {
  const {ownerId,id,title,slug,completeAt,visible,fiction,prospect,genreId,status,back,hook,synopsis,words,categories,authors} = req.body
  const props = {ownerId,id,title,slug,completeAt,visible,fiction,prospect,genreId,status,back,hook,synopsis,words,categories,authors}
  debug('request', props)

  return useApiHandler(
    res,
    'api/book/upsert',
    PrismaBook.upsert(props)
  )
}
export default request
