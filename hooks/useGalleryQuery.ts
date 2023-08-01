
import { useQuery, useQueryClient } from "react-query"
import { GalleryDetail } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import useDebug from "./useDebug"
import { RocketQuery } from "types/props"

const { debug, info } = useDebug("useGalleryQuery", )

type GalleryRocketQuery = RocketQuery<GalleryDetail>

const useGalleryQuery = (galleryId:string):GalleryRocketQuery => {

  if (!galleryId) {
    debug('getGalleryDetail galleryId is null')
    return {
      data: {},
      isLoading: false,
      error: {
        message: 'Param galleryId is not available'
      },
      invalidate: () => {}
    } as GalleryRocketQuery
  }

  const qc = useQueryClient()
  const galleryQuery = ["galleryDetail", `galleryDetail-${galleryId}`]

  const getGalleryDetail = async () => await getApi(`/gallery/${galleryId}`)

  const invalidate = () => {
    debug('invalidate',galleryQuery)
    qc.invalidateQueries(galleryQuery)
  }

  const query = useQuery(
    galleryQuery,
    getGalleryDetail,
    {
      onSettled(data: any,error: any) {
        if (error || data === null) {
          debug(`onSettled [${galleryQuery}] ERROR`, { error, data })
        }
        if (data) {
          const gallery = data.result ?? data
          debug(`onSettled [${galleryQuery}]`, {gallery})
          return gallery ?? undefined
        }
      }
    }
  )

  return {...query, invalidate} as GalleryRocketQuery
}

export default useGalleryQuery