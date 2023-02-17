import { ChatDetail, includes, User } from "../prismaContext"
import { log } from "../../utils/log"

const fileName = 'prismaChat'
const fileMethod = (method:string) => `${fileName}.${method}`
const chatError = (method: string, error?:any, message?: string) => {
  return {
    code: fileMethod(method), 
    message: error 
      ? error.message || 'Unknown error message' 
      : message || 'An unknown error has occurred'
  }
}

const trace = (method:string, t?:any) => log(fileMethod(method)+t?' '+JSON.stringify(t,null,2) :'')

const byId = async (id: string): Promise<ChatDetail | null> => {
  try {
    const result = await prisma.chatRoom.findFirst({
      where: {
        id: id,
        visible: true
      },
      include: includes.ChatDetailInclude,
    })
    if (result) {
      return result as unknown as ChatDetail
    }
    throw chatError('byId', null, 'Failed finding chatRoom')
  } catch (error) {
    throw chatError('byId', error, 'Unknown error occurred')
  }
}
type ChatCreateProps = {
  users: string[]
}

const connectToChat = async (props: ChatCreateProps): Promise<ChatDetail> => {
  try {
    const {users} = props
    const party = users.sort((a,b) => a < b ? -1: 1).join('-')
    const connect = users.map((u) => {return {id: u}})
    
    const chatRoom = await prisma.chatRoom.upsert({
      where: { party },
      create: { party },
      update: { users: { connect } },
      include: {
        users: true,
        messages: true
      }
    })
        
    return chatRoom as unknown as ChatDetail
  } catch (error) {
    trace("\tconnectToChat ERROR: ", error)
    throw chatError('connectToChat', error)
  }
}

export const PrismaChat = { byId, connectToChat}
