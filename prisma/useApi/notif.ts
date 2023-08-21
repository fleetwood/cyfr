import useDebug from "hooks/useDebug"
import { ShareAgentProps, ShareBookProps, ShareCharacterProps, ShareCoverProps, ShareEngageProps, ShareEventProps, ShareGalleryProps, ShareImageProps, NotifProps, ShareUserProps, NotifSendProps, Notif } from "prisma/prismaContext"
import { NotImplemented, sendApi } from "utils/api"

const {debug} = useDebug('hooks/useNotifApi')

  const send = async (props:NotifSendProps): Promise<Notif> => await (await sendApi("notif/send", {props})).data
  // const sharePost = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('sharePost')} //await (await sendApi("post/share", props)).data
  
  // const shareImage = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareImage')} //await (await sendApi("image/share", props)).data
  
  // const shareGallery = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareGallery')} //await (await sendApi("gallery/share", props)).data
  
  // const shareBook = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareBook')} //await (await sendApi("book/share", props)).data
  
  // const shareCharacter = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareCharacter')} //await (await sendApi("character/share", props)).data
  
  // const shareCover = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareCover')} //await (await sendApi("cover/share", props)).data
  
  // const shareEvent = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareEvent')} //await (await sendApi("event/share", props)).data
  
  // const shareAgent = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareAgent')} //await (await sendApi("event/share", props)).data
  
  // const shareUser = async (props: NotifProps):Promise<boolean> => {throw NotImplemented('shareUser')} //await (await sendApi("event/share", props)).data

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