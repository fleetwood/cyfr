import {
  ChatCreateProps,
  ChatDetail,
  ChatDetailInclude,
  SendMessageProps,
} from "../prismaContext";
import { now } from "next-auth/client/_utils";
import useDebug from "../../hooks/useDebug";
const {debug, info, fileMethod} = useDebug('entities/prismaChat')

const chatError = (method: string, error?: any, message?: string) => {
  return {
    code: fileMethod(method),
    message: error
      ? error.message || "Unknown error message"
      : message || "An unknown error has occurred",
  };
};


const byId = async (id: string): Promise<ChatDetail | null> => {
  try {
    const result = await prisma.chatRoom.findFirst({
      where: {
        id: id,
        visible: true,
      },
      include: ChatDetailInclude,
    });
    if (result) {
      return result as unknown as ChatDetail;
    }
    throw chatError("byId", null, "Failed finding chatRoom");
  } catch (error) {
    throw chatError("byId", error, "Unknown error occurred");
  }
};

const connectToChat = async (props: ChatCreateProps): Promise<ChatDetail> => {
  try {
    const { users } = props;
    const party = users.sort().join("-");
    const connect = users.map((u) => {
      return { id: u };
    });

    const chatRoom = await prisma.chatRoom.upsert({
      where: { party },
      create: { party },
      update: { users: { connect } },
      include: {
        users: true,
        messages: true,
      },
    });
    return chatRoom as unknown as ChatDetail;
  } catch (error) {
    info("connectToChat ERROR", error);
    throw chatError("connectToChat", error);
  }
};

const sendMessage = async (data: SendMessageProps) => {
  try {
    debug(`sendMessage`,data)
    const message = await prisma.chatMessage.create({ data });

    if (message) {
      const updateRoom = await prisma.chatRoom.update({
        where: {
          id: data.chatRoomId,
        },
        data: {
          updatedAt: now().toString(),
        },
      });
      if (updateRoom) {
        return message;
      }
      throw chatError("sendMessage", "failed to update room");
    }

    throw chatError("sendMessage", "failed to send message");
  } catch (error) {
    info("sendMessage ERROR:", error);
    throw chatError("sendMessage", error);
  }
};

export const PrismaChat = { byId, sendMessage, connectToChat };
