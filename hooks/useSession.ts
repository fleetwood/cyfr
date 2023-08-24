import { useQuery } from "react-query"
import { useRouter } from "next/router"
import useDebug from "./useDebug"
const {debug} = useDebug('useSession', )

export async function fetchSession() {
  const res = await fetch("/api/auth/session")
  const session = await res.json()
  if (Object.keys(session).length > 0) {
    return session
  }
  return null
}

export type SessionProps = {
  required: boolean
  redirectTo?: string | undefined
  queryConfig?: {} | undefined
}

export function useSession({
  required,
  redirectTo = "/login",
  queryConfig = {},
}: SessionProps) {
  const router = useRouter()
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (data || !required) return
      router.push(redirectTo || './login')
    },
  })
  return [query.data, query.status === "loading", query.error]
}
