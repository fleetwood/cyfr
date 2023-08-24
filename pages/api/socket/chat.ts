// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next"
import { Server } from "socket.io"
import useDebug from "../../../hooks/useDebug"
import {SocketListeners} from '../../../utils/api'
const {debug} = useDebug("api/socket")

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


  if (req.body?.body?.users) {
    const users = req.body.users

    const room = SocketListeners.chat.room(users),
          announce = SocketListeners.chat.announce(users),
          subscribe = SocketListeners.chat.subscribe(users)

    io.on(SocketListeners.connection, (socket) => {
        socket.join(room)
        debug(`io connection on ${JSON.stringify({socket: socket.id, room})}`)
        socket.to(room).on(announce, (obj) => {
            debug(`io emitting on ${JSON.stringify({socket: socket.id, room})}`)
            io.to(room).emit(subscribe, obj)
        })
    })
  }
  res.end()
}
