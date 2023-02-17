import { __host__, __port__ } from "./constants"
import axios from "axios"

export const apiUrl = (url: string) =>
  `http://${__host__}:${__port__}/api/${url}`

const postData = (body: any) => {
  return {
    body,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }
}

export const parseResponse = (response: any) => 
  JSON.parse(JSON.stringify(response))

export const getApi = async <T> (url: string): Promise<T|any> => {
  return parseResponse((await axios.get(apiUrl(url))).data)
}

export const sendApi = async (url: string, body: any) => {
  const sendTo = apiUrl(url)
  const post = postData(body)
  return axios.post(sendTo, post)
}

export const SocketListeners = {
  connection: 'connection',
  notification: {
    send: 'notification.send',
    listen: 'notification.listen',
  },
  channel: {
    send: (channel:string) => {return `send.channel.${channel}`},
    listen: (channel:string) => {return `listen.channel.${channel}`}
  },
  chat: {
    room: (users:string[]) => {return `chatroom::${users.sort((a,b) => a<b ? -1 : 1).join(':')}`},
    announce: (users:string[]) => {return `announce::${SocketListeners.chat.room(users)}`},
    subscribe: (users:string[]) => {return `subscribe::${SocketListeners.chat.room(users)}`},
  }
}