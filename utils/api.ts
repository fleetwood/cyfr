import { __host__, __port__, __site__ } from "./constants"
import axios from "axios"

export const NotImplemented = (file?:string) => {return {code: 500, message: `${file ? file + ': ' : ''}Not implemented`}}

export const apiUrl = (url: string) =>
  `${__site__}/api/${url}`

const postData = (body: any) => {
  return {
    ...body,
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
  const post = postData({...body})
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
    /**
     * creates a chatroom on socket io with the name 'chatroom::12345:23456'
     * @param users string[]
     * @returns chatroom::12345:23456
     */
    room: (users:string[]) => {return `chatroom::${users.sort((a,b) => a<b ? -1 : 1).join(':')}`},
    /**
     * announces to a chatroom on socket io, using the sorted users' id
     * @param users string[]
     * @returns announce::chatroom::12345:23456
     */
    announce: (users:string[]) => {return `announce::${SocketListeners.chat.room(users)}`},
    /**
     * subscribes to a chatroom on socket io, using the sorted users' id
     * @param users string[]
     * @returns subscribe::chatroom::12345:23456
     */
    subscribe: (users:string[]) => {return `subscribe::${SocketListeners.chat.room(users)}`},
  }
}