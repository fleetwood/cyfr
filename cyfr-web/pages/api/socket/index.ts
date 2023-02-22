// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next"
import { Server } from "socket.io"
import useDebug from "../../../hooks/useDebug"
import {SocketListeners} from '../../../utils/api'
const [debug] = useDebug('api/socket/index')

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  if (res.socket.server.io) {
    res.end()
    return
  }

  const io = new Server(res.socket.server)
  res.socket.server.io = io

  io.on(SocketListeners.connection, (socket) => {
    debug(`io connection on ${socket.id}`)
    socket.on(SocketListeners.notification.send, (obj) => {
      debug(`io emitting on ${socket.id}`)
      io.emit(SocketListeners.notification.listen, obj)
    })
  })

  res.end()
}
