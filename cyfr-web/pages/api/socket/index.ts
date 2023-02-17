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

  io.on(SocketListeners.connection, (socket) => {
    log(`io connection on ${socket.id}`)
    socket.on(SocketListeners.notification.send, (obj) => {
      log(`io emitting on ${socket.id}`)
      io.emit(SocketListeners.notification.listen, obj)
    })
  })

  res.end();
}
