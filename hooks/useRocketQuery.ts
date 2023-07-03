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

export const useRocketQuery = <T>({name, url, body, timeout=30000}:RocketQueryProps) => {
  const qc = useQueryClient()
  const queryKey = Array.isArray(name) ? [...name] : [name]
  const method = async () => body !== undefined ? (await sendApi(url, body)).data : await getApi(url)

  const query = useQuery(queryKey, method,
    {
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
    debug(`invalidateFeed`,{queryKey})
    qc.invalidateQueries(queryKey)
  }
  
  return { ...query, invalidate }
}

export default useRocketQuery
