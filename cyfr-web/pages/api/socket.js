import { Server } from "socket.io";
import {SocketListeners} from './../../utils/api'

export default function SocketHandler(req, res) {
  const { users } = req.body.body

  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on(SocketListeners.connection, (socket) => {
    socket.on(SocketListeners.notification.send, (obj) => {
      io.emit(SocketListeners.notification.listen, obj)
    })
    if (users) {
      socket.on(SocketListeners.chat.announce(users), (message) => {
        io.emit(SocketListeners.chat.subscribe(users), message)
      })
    }
  })

  res.end();
}
