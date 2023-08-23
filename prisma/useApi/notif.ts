import useDebug from "hooks/useDebug"
import {Notif,NotifSendProps} from "prisma/prismaContext"
import {sendApi} from "utils/api"

const {debug} = useDebug('hooks/useNotifApi')

  const send = async (props:NotifSendProps): Promise<Notif> => await (await sendApi("notif/send", {props})).data
  
  // BILLING
  const Billing = {
    success: ({userId, message, notifType='BILLING'}:NotifSendProps) => send({userId, message, notifType}),
    failed: ({userId, message, notifType='BILLING'}:NotifSendProps) => send({userId, message, notifType}),
    reminder: ({userId, message, notifType='BILLING'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // BOOK
  const Book = {
    agentWatching: ({userId, message, notifType='BOOK'}:NotifSendProps) => send({userId, message, notifType}),
    publisherWatching: ({userId, message, notifType='BOOK'}:NotifSendProps) => send({userId, message, notifType}),
    reading: ({userId, message, notifType='BOOK'}:NotifSendProps) => send({userId, message, notifType}),
    read: ({userId, message, notifType='BOOK'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // CHAT
  const Chat = {
    new: ({userId, message, notifType='CHAT'}:NotifSendProps) => send({userId, message, notifType}),
    reply: ({userId, message, notifType='CHAT'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // COMMENT
  const Comment = {
    article: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
    review: ({userId, message, notifType='COMMENT'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // COMMUNE
  const Commune = {
    joined: ({userId, message, notifType='COMMUNE'}:NotifSendProps) => send({userId, message, notifType}),
    left: ({userId, message, notifType='COMMUNE'}:NotifSendProps) => send({userId, message, notifType}),
  }
  
  // EVENT
  const Event = {
    comingUp: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    registration: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    started: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType}),
    ended: ({userId, message, notifType='EVENT'}:NotifSendProps) => send({userId, message, notifType})
  }

  // FAN
  const Fan = {
    article: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    artist: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    author: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    editor: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    fan: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    review: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
    user: ({userId, message, notifType='FAN'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // FEEDBACK
  const Feedback = {
    article: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    fan: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
    review: ({userId, message, notifType='FEEDBACK'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // FOLLOW
  const Follow = {
    agent: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    article: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    artist: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    author: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    editor: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='FOLLOW'}:NotifSendProps) => send({userId, message, notifType}),
  }
  
  // LIKE
  const Like = {
    agent: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    article: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    artist: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    author: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    editor: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='LIKE'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // MESSAGE
  const Message = {
    new: ({userId, message, notifType='MESSAGE'}:NotifSendProps) => send({userId, message, notifType})
  }

  // PUBLISH
  const Publish = {
    agent: ({userId, message, notifType='PUBLISH'}:NotifSendProps) => send({userId, message, notifType}),
    author: ({userId, message, notifType='PUBLISH'}:NotifSendProps) => send({userId, message, notifType}),
    artist: ({userId, message, notifType='PUBLISH'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='PUBLISH'}:NotifSendProps) => send({userId, message, notifType}),
    publisher: ({userId, message, notifType='PUBLISH'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // PURCHASES
  const Purchase = {
    book: ({userId, message, notifType='PURCHASE'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='PURCHASE'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='PURCHASE'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // REVIEW
  const Review = {
    article: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    artist: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    author: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    book: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    editor: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='REVIEW'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // SHARE
  const Share = {
    article: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    fan: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='SHARE'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // STAN
  const Stan = {
    article: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    fan: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    cover: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    chapter: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    character: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    gallery: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    image: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
    post: ({userId, message, notifType='STAN'}:NotifSendProps) => send({userId, message, notifType}),
  }

  // SUBMISSION
  const Submission = {
    new: ({userId, message, notifType='SUBMISSION'}:NotifSendProps) => send({userId, message, notifType}),
    read: ({userId, message, notifType='SUBMISSION'}:NotifSendProps) => send({userId, message, notifType}),
    accept: ({userId, message, notifType='SUBMISSION'}:NotifSendProps) => send({userId, message, notifType}),
    reject: ({userId, message, notifType='SUBMISSION'}:NotifSendProps) => send({userId, message, notifType}),
    considering: ({userId, message, notifType='SUBMISSION'}:NotifSendProps) => send({userId, message, notifType}),
  }
  
const useNotifApi = () => {
  return {
    Billing,
    Book,
    Chat,
    Comment,
    Commune,
    Event,
    Fan,
    Feedback,
    Follow,
    Like,
    Message,
    Publish,
    Purchase,
    Review,
    Share,
    Stan,
    Submission
  }
}

export default useNotifApi