import useDebug from "../../hooks/useDebug"
import { getApi, sendApi } from "../../utils/api"
import { GenreAddCoverProps, GenreStub } from "../prismaContext"

const {debug} = useDebug('hooks/useGenreApi', )

const useGenreApi = () => {

  const stubs = async ():Promise<GenreStub[]> => await(await getApi('genre/stubs')) as GenreStub[]
  const addCover = async (props: GenreAddCoverProps):Promise<GenreStub> => await (await sendApi("genre/addCover", props)).data

  return {
    addCover
    , stubs
  }
}

export default useGenreApi