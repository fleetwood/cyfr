import useApiHandler from 'hooks/useApiHandler'
import { NotifSendProps, PostEngageProps, PrismaPost } from 'prisma/prismaContext'
import { NextApiRequest, NextApiResponse } from 'next'
import {PrismaNotif} from 'prisma/entities/prismaNotif'

const request = (req: NextApiRequest, res: NextApiResponse) =>{
  const {props} = req.body
  return useApiHandler(
    res,
    'api/notif/send',
    PrismaNotif.send(props as NotifSendProps)
  )}
export default request
