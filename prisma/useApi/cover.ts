import useDebug from "../../hooks/useDebug"
import { getApi } from "../../utils/api"
import { Cover, CoverStub } from "../prismaContext"

const {debug, info} = useDebug('hooks/useCoverApi', )

const useCoverApi = () => {

  const findCover = async(genreTitle?:string):Promise<CoverStub[]> => await getApi(`cover/findCover${genreTitle ? `?genre=${genreTitle}` : ''}`) as CoverStub[]
  
  const stubs = async ():Promise<CoverStub[]> => await (await getApi('cover/stubs')).result as CoverStub[]

  return {
    findCover
    , stubs
  }
}

export default useCoverApi