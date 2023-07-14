import useDebug from "../../hooks/useDebug"
import { getApi, sendApi } from "../../utils/api"
import { GenreAddCoverProps, GenreStub } from "../prismaContext"

const {debug} = useDebug('hooks/useGenreApi', 'DEBUG')

const useGenreApi = () => {

  const stubs = async ():Promise<GenreStub[]> => (await getApi('genre/stubs')).result as GenreStub[]
  const addCover = async (props: GenreAddCoverProps):Promise<GenreStub> => await (await sendApi("genre/addCover", props)).data

  return {
    addCover
    , stubs
  }
}

export default useGenreApi