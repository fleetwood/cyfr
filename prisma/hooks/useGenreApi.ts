import useDebug from "../../hooks/useDebug"
import { sendApi } from "../../utils/api"
import { GenreAddCoverProps, GenreStub } from "../prismaContext"

const {debug} = useDebug('hooks/useGenreApi')

const useGenreApi = () => {

  const addCover = async (props: GenreAddCoverProps):Promise<GenreStub> => await (await sendApi("genre/addCover", props)).data

  return {
    addCover
  }
}

export default useGenreApi