import useDebug from "hooks/useDebug"
import { ShareAgentProps, ShareBookProps, ShareCharacterProps, ShareCoverProps, ShareEngageProps, ShareEventProps, ShareGalleryProps, ShareImageProps, NotifProps, ShareUserProps, NotifSendProps, Notif } from "prisma/prismaContext"
import { NotImplemented, sendApi } from "utils/api"

const {debug} = useDebug('hooks/useNotifApi')

  const send = async (props:NotifSendProps): Promise<Notif> => await (await sendApi("notif/send", {props})).data
  
  // SHARES

  // LIKES

  // COMMENTS

  // FEEDBACK

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