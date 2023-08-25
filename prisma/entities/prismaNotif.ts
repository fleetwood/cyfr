import dayjs from 'dayjs'
import useDebug from 'hooks/useDebug'
import {Notif, NotifMarkProps, NotifSendProps, NotifType} from 'prisma/prismaContext'
import {dbDateFormat, now} from 'utils/helpers'

const { debug, info, fileMethod } = useDebug('entities/prismaNotif', 'DEBUG')

const notif = async ({userId, notifType, message}:NotifSendProps): Promise<Notif> =>{
  try {
    const data = {
      user: {
        connect: {
          id: userId,
        },
      },
      expiresAt: dayjs().add(1, 'w').toDate(),
      notifType,
      message,
    }
    debug('notif', {userId, notifType, message, data})
    return await prisma.notif.create({ data })
  } catch (error) {
    debug('notif.FAIL', {error})
    throw error
  }
}

const notifUpdate = (props: NotifMarkProps): Promise<Notif> => prisma.notif.update({ where: { id: props.id }, data: { } })

const notifLike = ({userId, message}: {userId: string, message: string}): Promise<Notif> => notif({userId, notifType: 'LIKE', message})

const notifShare = ({userId, message}: {userId: string, message: string}): Promise<Notif> => notif({userId, notifType: 'SHARE', message})

const send  = (props:NotifSendProps): Promise<Notif> => notif(props)

const markAs = async ({id, visible=true, seen}:NotifMarkProps):Promise<Notif> => await prisma.notif.update({where: {id}, data: { visible, seen: seen ?? now()}})

export const PrismaNotif = {
  markAs,
  send,
  notifLike,
  notifShare
}
