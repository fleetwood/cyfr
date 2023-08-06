import useApiHandler from 'hooks/useApiHandler'
import useDebug from 'hooks/useDebug'
import {NextApiRequest, NextApiResponse} from 'next'
import {PrismaCover} from 'prisma/prismaContext'

const { debug } = useDebug('api/cover/upsert', 'DEBUG')

const request = (req: NextApiRequest, res: NextApiResponse) => {
  const {id,creatorId,imageId,bookId,genreId,visible,exclusive,description} = req.body
  debug('upsert', {
    props: {id,creatorId,imageId,bookId,genreId,visible,exclusive,description}
  })

  return useApiHandler(
    res,
    'api/cover/upsert',
    PrismaCover.upsert({id,creatorId,imageId,bookId,genreId,visible,exclusive,description})
  )
}

export default request
