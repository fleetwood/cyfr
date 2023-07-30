import useDebug from "hooks/useDebug"
import { ShareBookProps, ShareCharacterProps, ShareCoverProps, ShareEngageProps, ShareEventProps, ShareGalleryProps, ShareImageProps, SharePostProps } from "prisma/prismaContext"
import { NotImplemented } from "utils/api"

const {debug} = useDebug('hooks/useShareApi')

  const reshare = async (props: ShareEngageProps):Promise<boolean> => {throw NotImplemented('reshare')} //await (await sendApi("post/share", props)).data
  
  const sharePost = async (props: SharePostProps):Promise<boolean> => {throw NotImplemented('sharePost')} //await (await sendApi("post/share", props)).data
  
  const shareImage = async (props: ShareImageProps):Promise<boolean> => {throw NotImplemented('shareImage')} //await (await sendApi("image/share", props)).data
  
  const shareGallery = async (props: ShareGalleryProps):Promise<boolean> => {throw NotImplemented('shareGallery')} //await (await sendApi("gallery/share", props)).data
  
  const shareBook = async (props: ShareBookProps):Promise<boolean> => {throw NotImplemented('shareBook')} //await (await sendApi("book/share", props)).data
  
  const shareCharacter = async (props: ShareCharacterProps):Promise<boolean> => {throw NotImplemented('shareCharacter')} //await (await sendApi("character/share", props)).data
  
  const shareCover = async (props: ShareCoverProps):Promise<boolean> => {throw NotImplemented('shareCover')} //await (await sendApi("cover/share", props)).data
  
  const shareEvent = async (props: ShareEventProps):Promise<boolean> => {throw NotImplemented('shareEvent')} //await (await sendApi("event/share", props)).data

  const like = async (props: ShareEngageProps):Promise<boolean>  => {throw NotImplemented('like')}  //await (await sendApi("post/like", props)).data

const useShareApi = () => {
  return {
    reshare
    , like
    , sharePost
    , shareImage
    , shareGallery
    , shareBook
    , shareCharacter
    , shareCover
    , shareEvent
  }
}

export default useShareApi