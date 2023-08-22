import useDebug from "hooks/useDebug"
import { ShareAgentProps, ShareBookProps, ShareCharacterProps, ShareCoverProps, ShareEngageProps, ShareEventProps, ShareGalleryProps, ShareImageProps, NotifProps, ShareUserProps, NotifSendProps, Notif } from "prisma/prismaContext"
import { NotImplemented, sendApi } from "utils/api"

const {debug} = useDebug('hooks/useNotifApi')

  const send = async (props:NotifSendProps): Promise<Notif> => await (await sendApi("notif/send", {props})).data
  
  // SHARES
  const Events = {
    comingUp: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    registration: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    started: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    ended: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType})
  }

  // LIKES
  const Likes = {
    article: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // COMMENTS
  const Comments = {
    article: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // SHARES
  const Shares = {
    article: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
  }
  
  
  // FEEDBACKS
  const Feedbacks = {
    article: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
  }
  

  // EVENTS

  // REVIEWS

  // PURCHASES

  // SUBMISSIONS

  // MESSAGES

  // BILLING

  // FOLLOWS

  // STAN ACTIVITY

  // COMMUNES

  // PUBLISH
  
const useNotifApi = () => {
  return {
    // sharePost
    // , shareImage
    // , shareGallery
    // , shareBook
    // , shareCharacter
    // , shareCover
    // , shareEvent
    // , shareAgent
    // , shareUser
    send
  }
}

export default useNotifApi