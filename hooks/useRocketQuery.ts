import { useQuery, useQueryClient } from "react-query"
import { getApi, sendApi } from "../utils/api"
import useDebug from "./useDebug"

const {debug} = useDebug("useRocketQuery")

export type RocketQueryProps = {
  name:     string | string[] | (string | { type: string; })[]
  url:      string
  body?:    any
  timeout?: number
}

export type RocketQuery<T> = {
    data:       T
    isLoading:  boolean
    error:      any
    invalidate: () => void
    refetch:    () => void
}

export const useRocketQuery = <T>({name, url, body, timeout=30000}:RocketQueryProps):RocketQuery<T> => {
  const qc = useQueryClient()
  const queryKey = Array.isArray(name) ? [...name] : [name]
  const method = async () => body !== undefined ? (await sendApi(url, body)).data as T : await getApi(url) as T
  debug('useRocketQuery', {name, url})

  const query = useQuery<T>(queryKey, method,{
      refetchInterval: timeout,
      onSettled(data,error) {
        if (error || data === undefined) {
          debug(`onSettled(${queryKey}) ERROR`,{ error, data })
        }
        if (data) {
          debug(`onSettled(${queryKey})`,data)
          return data as T
        }
        return null
      }
    }
  )

  const invalidate = () => {
    debug(`invalidate`,{queryKey})
    qc.invalidateQueries(queryKey)
  }

  const refetch = () => {
    debug('refetch', {queryKey})
    qc.refetchQueries(queryKey)
  }
  
  return { ...query, invalidate, refetch } as RocketQuery<T>
}

export default useRocketQuery
