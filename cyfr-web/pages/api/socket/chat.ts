// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import {SocketListeners} from '../../../utils/api'
import { log } from "../../../utils/log";

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;


  if (req.body?.body?.users) {
    const users = req.body.body.users

    const room = SocketListeners.chat.room(users),
          announce = SocketListeners.chat.announce(users),
          subscribe = SocketListeners.chat.subscribe(users)

    io.on(SocketListeners.connection, (socket) => {
        socket.join(room)
        log(`io connection on ${JSON.stringify({socket: socket.id, room})}`)
        socket.to(room).on(announce, (obj) => {
            log(`io emitting on ${JSON.stringify({socket: socket.id, room})}`)
            io.to(room).emit(subscribe, obj)
        })
    })
  }
  res.end();
}
