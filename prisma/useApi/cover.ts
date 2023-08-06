import useDebug from "../../hooks/useDebug"
import { getApi, sendApi } from "../../utils/api"
import { Cover, CoverDetail, CoverStub, CoverUpsertProps } from "../prismaContext"

const {debug, info} = useDebug('hooks/useCoverApi', 'DEBUG')

const useCoverApi = () => {

  const findCover = async(genreTitle?:string):Promise<CoverStub[]> => await getApi(`cover/findCover${genreTitle ? `?genre=${genreTitle}` : ''}`) as CoverStub[]
  
  const stubs = async ():Promise<CoverStub[]> => await (await getApi('cover/stubs')).result as CoverStub[]

  const stub = async (id:string):Promise<CoverStub> => await (await getApi(`cover/${id}/stub`)).result as CoverStub

  const detail = async (id:string):Promise<CoverDetail> => await (await getApi(`cover/${id}/detail`)).result as CoverDetail

  const upsert = async (props:CoverUpsertProps):Promise<CoverStub> => {
    debug('upsert', {props})
    try {
      return await(await sendApi('cover/upsert', props)).data as CoverStub
    } catch (error) {
      console.error(error)
      throw(error)
    }
  }

  return {
    findCover
    , stubs
    , upsert
  }
}

export default useCoverApi