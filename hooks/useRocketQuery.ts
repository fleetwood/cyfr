import { useQuery, useQueryClient } from "react-query"
import { getApi, sendApi } from "../utils/api"
import useDebug from "./useDebug"

const {debug} = useDebug("useRocketQuery","DEBUG")

export type RocketQueryProps = {
  name:   string | string[]
  url:    string
  body?:  any
}

export const useRocketQuery = async <T>({name, url, body}:RocketQueryProps) => {
  const qc = useQueryClient()
  const queryKey = Array.isArray(name) ? [...name] : [name]
  const method = async () => body !== null && body !== undefined ? sendApi(url, body) : getApi(url)

  const query = useQuery(queryKey, method,
    {
      onSettled(data,error) {
        if (error || data === null) {
          debug(`onSettled(${queryKey}) ERROR`,{ error, data })
        }
        if (data) {
          debug(`onSettled(${queryKey})`,{ data })
          return data as T
        }
      }
    },
  )

  const invalidate = () => {
    debug(`invalidateFeed`,{queryKey})
    qc.invalidateQueries(queryKey)
  }
  
  return { ...query, invalidate }
}

export default useRocketQuery
